import React, { Fragment, useState } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

// Material UI
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import { Avatar, Button, Divider, ListItem, ListItemAvatar, ListItemText, Typography, Box } from "@mui/material";

// redux
import { connect } from "react-redux";
import { addComment, deleteComment } from "../../redux/actions/product";
import { setAlert } from "../../redux/actions/alert";
import Spinner from "../../Spinner/Spinner";

const Comment = ({ user, profiles, product, commentLoading, addComment, deleteComment, setAlert }) => {
  //   Add Comment
  const [formData, setFormData] = useState({
    description: "",
  });
  const { description } = formData;
  const onChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Description
  const onSubmit = (e, id) => {
    e.preventDefault();
    !description ? setAlert("Add Description", "danger") : addComment(id, formData);
  };
  // End add comment

  // Delete Comment
  const deleteProductComment = (e, prd_id, cmnt_id) => {
    e.preventDefault();
    deleteComment(prd_id, cmnt_id);
  };
  //   Avatar
  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  // Color Icon Button
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));
  return (
    <div>
      <header className="fs-3">Comments</header>
      {user && product ? (
        <form className="mb-5" onSubmit={(e) => onSubmit(e, product._id)}>
          <div className="form-floating my-3">
            <textarea
              className="form-control"
              id="floatingTextarea2"
              placeholder="Add a comment"
              style={{ height: "100px" }}
              name="description"
              value={description}
              onChange={(e) => onChange(e)}
            ></textarea>
            <label htmlFor="floatingTextarea2">Add a comment</label>
          </div>
          <button type="submit" className="btn btn-primary">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="lead text-primary text-bold">Login to add a comment</p>
      )}
      {!commentLoading ? (
        product.comments &&
        profiles.length > 0 &&
        product.comments.map((comment) => (
          <Fragment key={comment._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {profiles.filter((profile) => profile.user === comment.user)[0].avatar ? (
                  <Avatar alt="Preview" src={profiles.filter((profile) => profile.user === comment.user)[0].avatar} />
                ) : (
                  <Avatar {...stringAvatar(profiles.filter((profile) => profile.user === comment.user)[0].name)} />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography variant="h6" component="div">
                      {profiles.filter((profile) => profile.user === comment.user)[0].name}
                    </Typography>
                    <Typography variant="caption" display="block" gutterBottom sx={{ color: "gray" }}>
                      <Moment format="DD MMMM YYYY hh:mm A">{comment.postedOn}</Moment>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {comment.description}
                    </Typography>
                    {user && comment.user === user._id ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          p: 1,
                          m: 1,
                          bgcolor: "background.paper",
                        }}
                      >
                        <ColorButton variant="contained" size="small" onClick={(e) => deleteProductComment(e, product._id, comment._id)}>
                          <DeleteIcon />
                        </ColorButton>
                      </Box>
                    ) : (
                      ""
                    )}
                  </Fragment>
                }
              />
            </ListItem>
            <Divider variant="fullwidth" component="div" />
          </Fragment>
        ))
      ) : (
        <Spinner />
      )}
    </div>
  );
};

Comment.propTypes = {
  addComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  commentLoading: state.product.commentLoading,
  profiles: state.profile.profiles,
});

export default connect(mapStateToProps, { addComment, deleteComment, setAlert })(Comment);
