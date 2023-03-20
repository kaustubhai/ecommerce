import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Editor from "../components/Editor";
import { Alert, Row } from "react-bootstrap";
import { sendNewsletter } from "../actions/userActions";
import Loader from "../components/Loader";

const Newsletter = ({ history }) => {
  const dispatch = useDispatch();
  const [subject, setSubject] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { loading, msg } = useSelector((state) => state.newsletter);

  const dispatchNewsletter = (e, body) => {
    e.preventDefault();
    if (!subject || !body) return alert("Please enter subject and body");
    dispatch(sendNewsletter(subject, body));
  };
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);
  return (
    <div>
      <Row>
        <h1 className="py-3 text-center">Create newsletter</h1>
      </Row>
      {msg && (
        <Row>
          <Alert variant="info">{msg}</Alert>
        </Row>
      )}
      <Row>
        <input
          className="w-full mb-2 p-2"
          placeholder="Enter Subject here..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </Row>
      {loading ? <Loader /> : <Editor dispatch={dispatchNewsletter} />}
    </div>
  );
};

export default Newsletter;
