import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { firestore } from "../Config/Config";
import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import '../Frontend/Stickwall.css';

export default function SticksCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sticksForSelectedDate, setSticksForSelectedDate] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteStickId, setDeleteStickId] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchSticksForSelectedDate(date);
  };

  const fetchSticksForSelectedDate = async (date) => {
    const selectedDateStart = new Date(date);
    selectedDateStart.setHours(0, 0, 0, 0);

    const selectedDateEnd = new Date(date);
    selectedDateEnd.setHours(23, 59, 59, 999);

    const sticksCollectionRef = collection(firestore, "Sticks");

    const selectedDateQuery = query(
      sticksCollectionRef,
      where("dateCreated", ">=", selectedDateStart),
      where("dateCreated", "<=", selectedDateEnd)
    );

    const selectedDateQuerySnapshot = await getDocs(selectedDateQuery);
    const selectedDateSticksData = selectedDateQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    setSticksForSelectedDate(selectedDateSticksData);
  };

  const deleteStick = async () => {
    try {
      if (deleteStickId) {
        await deleteDoc(doc(firestore, "Sticks", deleteStickId));
        setSticksForSelectedDate((prevSticks) =>
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

  const handleDeleteClick = (stickId) => {
    setDeleteStickId(stickId);
    setDeleteModalVisible(true);
  };

  return (
    <div className="sticks-calendar" style={{textAlign:'center'}} >
      <h1>Sticks for Selected Date</h1>
      <div className="calendar-container" style={{ display: 'block',display: 'flex', justifyContent: 'center'}}>
        <Calendar onChange={handleDateChange} value={selectedDate}  />
      </div>
      <div className="sticks-container" style={{ display: 'block' }}>
        {sticksForSelectedDate.map((card, i) => (
          <div
            key={i}
            style={{ backgroundColor: card.bgcolor, borderRadius: '10px',textAlign:'start' }}
            className="card p-3 m-2 sticksCard col-md-3 col-sm-4 col-xl-2 col-xxl-1"
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
            <Button type="danger" icon={<DeleteOutlined />} style={{ color: "red" }}  onClick={() => handleDeleteClick(card.id)}>
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
