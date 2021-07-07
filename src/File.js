import { Button, IconButton, Input } from "@material-ui/core";
import React from "react";
import AddBoxIcon from "@material-ui/icons/Image";
import "./File.css";

const File = ({ img, setImg, dialogInput, setDialogInput }) => {
  return (
    <div>
      <div className="img">
        <img src={img} alt="" style={{ display: !img ? "none" : true }} />
      </div>
      <div className="image__buttons">
        <IconButton variant="contained" component="label">
          <AddBoxIcon fontSize="small" />
          <input
            className="file__input"
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];

              const reader = new FileReader();

              reader.addEventListener(
                "load",
                () => {
                  setImg(reader.result);
                  console.log(reader.result);
                  console.log(reader);
                },
                false
              );

              if (file) {
                reader.readAsDataURL(file);
              }
            }}
            accept="image/*"
          />
        </IconButton>
        <Input
          value={dialogInput}
          onChange={(e) => {
            setDialogInput(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            setImg("");
          }}
        >
          Remove Image
        </Button>
      </div>
    </div>
  );
};

export default File;
