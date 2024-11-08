// react-pintura
import { PinturaEditor } from "@pqina/react-pintura";

// pintura
import "@pqina/pintura/pintura.css";

import {
  // editor
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,

  // plugins
  setPlugins,
  plugin_crop,
  plugin_finetune,
  plugin_finetune_defaults,
  plugin_filter,
  plugin_filter_defaults,
  plugin_annotate,
  markup_editor_defaults,
} from "@pqina/pintura";

import {
  LocaleCore,
  LocaleCrop,
  LocaleFinetune,
  LocaleFilter,
  LocaleAnnotate,
  LocaleMarkupEditor,
} from "@pqina/pintura/locale/en_GB";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);
const editorDefaults = {
  utils: ["crop", "finetune", "filter", "annotate"],
  imageReader: createDefaultImageReader(),
  imageWriter: createDefaultImageWriter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  ...plugin_finetune_defaults,
  ...plugin_filter_defaults,
  ...markup_editor_defaults,
  locale: {
    ...LocaleCore,
    ...LocaleCrop,
    ...LocaleFinetune,
    ...LocaleFilter,
    ...LocaleAnnotate,
    ...LocaleMarkupEditor,
  },
};
const Editor = ({ imgSrc, imageId, updateImage }) => {
  // const [result, setResult] = useState("");

  return (
    <div>
      <div style={{ height: "70vh" }}>
        <PinturaEditor
          {...editorDefaults}
          src={
            imgSrc ||
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1730711400710"
          }
          // onLoad={(res) => console.log("load image", res)}
          onProcess={({ dest }) => {
            // setResult(URL.createObjectURL(dest))
            // console.log(URL.createObjectURL(dest))
            updateImage(imageId, URL.createObjectURL(dest));
          }}
        />
      </div>

      {/* {!!result.length && (
        <p>
          <img src={result} alt="" />
        </p>
      )} */}
    </div>
  );
};

export default Editor;
