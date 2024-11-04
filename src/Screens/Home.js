import React, { Fragment, useEffect, useState } from "react";
import { createApi } from "unsplash-js";
import SearchAppBar from "../Components/NavBar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import SkeletonCom from "../Components/Skeleton";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import Editor from "../Components/Editor";
import Popup from "../Components/Popup";

const api = createApi({
  accessKey: "nwjXJuP6AI73YO0Ccqb5OByKvv4PaThWoXmCft_sltw",
});
const Home = () => {
  const [data, setPhotosResponse] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    api.search
      .getPhotos({
        query: searchValue || "laptop",
        page: pageNumber,
        per_page: "20",
      })
      .then((result) => {
        setPhotosResponse(result);
        setLoading(false);
      });
  }, [searchValue, pageNumber]);
  const handleChange = (e) => {
    setSearchValue(e.target.value);
    setPageNumber(1);
  };
  const handlePagesNumber = (e) => {
    setPageNumber(e.target.textContent);
  };

  const updateImage = (id, newImage) => {
    // console.log(id);
    console.log(newImage);

    // console.log(data.response.results.map((item) =>
    //   item.id === id
    //     ? {
    //         newStyle: newImage,
    //         ...item,
    //       }
    //     : item
    // ))
    setPhotosResponse((prevData) => ({
      ...prevData,
      response: {
        ...prevData.response,
        results: prevData.response.results.map((item) =>
          item.id === id
            ? {
                ...item,
                newStyle: newImage, // Update with the new image style
              }
            : item
        ),
      },
    }));

    togglePopup();
  };

  // useEffect(() => {

  //   console.log("first")
  // },[data]);

  const downloadImage = async (imageUrl) => {
    const response = await fetch(imageUrl);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a new anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = "downloaded-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    window.URL.revokeObjectURL(url);
  };

  return (
    <Fragment>
      <Popup isOpen={isPopupOpen} onClose={togglePopup}>
        <Editor
          imgSrc={selectedItem.newStyle || selectedItem?.urls?.small}
          imageId={selectedItem?.id}
          updateImage={updateImage}
        />
      </Popup>
      <SearchAppBar handleChange={handleChange} />
      <Container
        sx={{
          minHeight: "100vh",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          mb: "20px",
        }}
      >
        {loading ? (
          <SkeletonCom />
        ) : (
          <Box
            sx={{
              width: "100%",
              flexWrap: "wrap",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {data.response.results.map((item) => {
              return (
                <Card
                  key={item.id}
                  sx={{
                    // maxWidth: 345,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "20px 10px",
                    width: 350,
                    borderRadius: "20px",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item?.newStyle || item.urls.small}
                    alt=""
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.alt_description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {/* {item.tags[0]?.title} */}
                      {item.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      flexWrap: "wrap",
                    }}
                  >
                    <Button size="small">
                      <Link
                        style={{
                          textTransform: "none",
                          textDecoration: "none",
                        }}
                        href={item.urls.full}
                        target="_blank" // Opens the link in a new tab
                      >
                        Original High Resolution
                      </Link>
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedItem(item);
                        togglePopup();
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        downloadImage(item?.newStyle || item.urls.small);
                        // setSelectedItem(item);
                        // togglePopup();
                      }}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        )}
        <Stack spacing={2}>
          {loading ? (
            ""
          ) : data.response.total_pages > 1 ? (
            <Pagination
              onClick={handlePagesNumber}
              count={data.response.total_pages}
              color="secondary"
            />
          ) : (
            ""
          )}
        </Stack>
      </Container>
    </Fragment>
  );
};
export default Home;
