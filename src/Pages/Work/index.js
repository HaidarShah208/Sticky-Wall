import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../Config/Config";
import { Card, Button, message, Modal } from "antd";  
import dayjs from "dayjs"; 
import "./AllSticksPage.css";
import { DeleteOutlined } from "@ant-design/icons";

export default function Work() {
  const [sticks, setSticks] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStickId, setDeleteStickId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const sticksCollectionRef = collection(firestore, "Sticks");
      const sticksQuerySnapshot = await getDocs(sticksCollectionRef);
      const sticksData = [];

      sticksQuerySnapshot.forEach((doc) => {
        sticksData.push({ id: doc.id, ...doc.data() });
      });

      setSticks(sticksData);
    };

    fetchData();
  }, []);

  const handleDeleteClick = (stickId) => {
    setDeleteStickId(stickId);
    setDeleteModalVisible(true);
  };

  const deleteStick = async () => {
    try {
      if (deleteStickId) {
        await deleteDoc(doc(firestore, "Sticks", deleteStickId));
        setSticks((prevSticks) =>
          prevSticks.filter((stick) => stick.id !== deleteStickId)
        );
        message.success("Card deleted successfully");
        setDeleteModalVisible(false);
      } else {
        message.error("Invalid stick ID");
      }
    } catch (error) {
      console.error("Error deleting stick:", error);
      message.error("An error occurred while deleting the card");
    }
  };

  return (
    <div className="all-sticks-container">
      {sticks.map((card, i) => (
        <Card
          key={i}
          style={{ backgroundColor: card.bgcolor, borderRadius: "10px" }}
          className="card p-2 m-2 sticksCard col-md-3 col-sm-5 col-xl-2 col-xxl-1"
        >
          <h5>{card.title}</h5>
          <p>
            <b>
              <u>Date</u>
            </b>
          </p>
          <p>{dayjs(card.date.toDate()).format("MM/DD/YYYY")}</p>

          <p>
            <b>
              <u>Location</u>
            </b>
          </p>
          <p>{card.location}</p>
          <p>
            <b>
              <u>Description</u>
            </b>
          </p>
          <p>{card.description}</p>

          <Button type="danger" icon={<DeleteOutlined />} style={{color:'red'}} onClick={() => handleDeleteClick(card.id)}>
          </Button>
        </Card>
      ))}

      <Modal
        title="Delete Stick"
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onOk={deleteStick}
      >
        <p>Are you sure you want to delete this card?</p>
      </Modal>
    </div>
  );
}
