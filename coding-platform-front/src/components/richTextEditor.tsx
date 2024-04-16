import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  // ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }, { header: 3 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

type RichTextEditor = {
  description: string;
  setDescription: (description: string) => void;
};

export const RichTextEditor: React.FC<RichTextEditor> = ({ description, setDescription }) => {
  return (
    <ReactQuill
      theme="snow"
      className="m-0 p-0"
      modules={{
        toolbar: toolbarOptions,
      }}
      value={description}
      onChange={setDescription}
    />
  );
};
