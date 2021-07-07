import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Fab,
  IconButton,
  Input,
  Popover,
  Snackbar,
} from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import CheckIcon from "@material-ui/icons/Check";
import SidebarChat from "./SidebarChat";
import db from "./firebase";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import { useStateValue } from "./StateProvider";

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarContent, setSnakbarContent] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogInput, setDialogInput] = useState();
  const [seed, setSeed] = useState("");
  const [isDialogButtonDisabled, setIsDialogInputDisabled] = useState(true);
  const { user, SignOut } = useStateValue();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        })
      );
    });
  }, []);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 500000));
  }, []);

  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

  const createChat = (e) => {
    e.preventDefault();

    setOpenSnackbar(false);
    setSnakbarContent("");
    setDialogInput("");
    setOpenDialog(true);

    if (dialogInput) {
      if (dialogInput.length > 6 && dialogInput.length < 30) {
        db.collection("rooms").add({ name: dialogInput });
        setDialogInput("");
        setOpenDialog(false);
        setIsDialogInputDisabled(true);
        setSnakbarContent("Created a new Chat successfully");
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <div className="logout__iconButton">
            <IconButton
              onClick={(e) => {
                setAnchorEl(e.currentTarget);
              }}
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              open={open}
              onBackdropClick={() => {
                setAnchorEl(null);
              }}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Button
                onClick={() => {
                  SignOut();
                  setAnchorEl(null);
                }}
              >
                Logout
              </Button>
            </Popover>
          </div>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search or Start new"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="sidebar__chats">
        <div className="sidebar__chat">
          {rooms
            .filter((user) => {
              if (inputValue === "") {
                return user;
              }
              if (
                user.data.name.toLowerCase().includes(inputValue.toLowerCase())
              ) {
                return user;
              }
            })
            .map((room) => {
              return (
                <SidebarChat id={room.id} key={room.id} name={room.data.name} />
              );
            })}
        </div>
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          autoHideDuration={6000}
          message={snackbarContent}
        ></Snackbar>
        <Dialog
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
          }}
          onBackdropClick={() => {
            setOpenDialog(false);
          }}
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogContent>
            <h2>Set Chat Name</h2>
          </DialogContent>
          <Divider />
          <DialogContent>
            <div className="dialog__content">
              <Avatar
                src={`http://avatars.dicebear.com/api/human/${seed}.svg`}
              />
              <ThemeProvider theme={theme}>
                <form action="" onSubmit={createChat}>
                  <Input
                    style={{ width: "100%" }}
                    className="mui__input"
                    onLoad={(e) => {
                      if (e.target.value === "") {
                        setIsDialogInputDisabled(true);
                      }
                    }}
                    autoComplete="false"
                    value={dialogInput}
                    onChange={(e) => {
                      setDialogInput(e.target.value);
                      if (e.target.value.length >= 6) {
                        setIsDialogInputDisabled(false);
                      }
                      if (e.target.value.length < 6) {
                        setIsDialogInputDisabled(true);
                      }
                      if (e.target.value.length > 30) {
                        setIsDialogInputDisabled(true);
                      }
                    }}
                  />
                </form>
              </ThemeProvider>
              <IconButton
                disabled={isDialogButtonDisabled}
                onClick={createChat}
              >
                <CheckIcon />
              </IconButton>
            </div>
          </DialogContent>
        </Dialog>
        <Fab className="add__chat" aria-label="add" onClick={createChat}>
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default Sidebar;
