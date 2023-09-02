import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { firestore } from "../Config/Config";
import { Button, message, Modal } from "antd";
import "../Frontend/Stickwall.css";
import { DeleteOutlined } from "@ant-design/icons";


export default function Today() {
  const [todaySticks, setTodaySticks] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStickId, setDeleteStickId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const sticksCollectionRef = collection(firestore, "Sticks");
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const todayQuery = query(
        sticksCollectionRef,
        where("dateCreated", ">=", startOfToday),
        where("dateCreated", "<=", endOfToday)
      );

      const todayQuerySnapshot = await getDocs(todayQuery);
      const todaySticksData = todayQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      console.log("Fetched Data:", todaySticksData); // Log the fetched data for debugging

      setTodaySticks(todaySticksData);
    };

    fetchData();
  }, []);

  const deleteStick = async () => {
    try {
      if (deleteStickId) {
        await deleteDoc(doc(firestore, "Sticks", deleteStickId));
        setTodaySticks((prevSticks) => prevSticks.filter((stick) => stick.id !== deleteStickId));
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

  const handleDeleteClick = (stickId) => {
    setDeleteStickId(stickId);
    setDeleteModalVisible(true);
  };

  return (
    <div className="sticks-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
      <h1 style={{ width: '100%', textAlign: 'center' }}>Today's Sticks</h1>
      <div style={{ width: '100%' }}>
        {todaySticks.map((card, i) => (
          <div
            key={i}
            style={{ backgroundColor: card.bgcolor, borderRadius: '10px' }}
            className="card p-3 m-2 sticksCard col-md-3 col-sm-5 col-xl-2 col-xxl-1"
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
            <Button type="danger" icon={<DeleteOutlined />} style={{ color: "red" }} onClick={() => handleDeleteClick(card.id)}>
            </Button>
          </div>
        ))}
      </div>
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
