import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import dayjs from "dayjs";
import { firestore } from "../Config/Config";
import { Button, DatePicker, Form, Input, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "../Frontend/Stickwall.css";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat)


export default function Upcoming() {
  const [allSticks, setAllSticks] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDate, setEditedDate] = useState(null);
  const [editedLocation, setEditedLocation] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const sticksCollectionRef = collection(firestore, "Sticks");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayQuery = query(
        sticksCollectionRef,
        where("dateCreated", ">=", today)
      );

      const todayQuerySnapshot = await getDocs(todayQuery);
      const todaySticksData = todayQuerySnapshot.docs.map((doc) => doc.id);

      const allQuery = query(sticksCollectionRef);

      const allQuerySnapshot = await getDocs(allQuery);
      const allSticksData = allQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredSticksData = allSticksData.filter(
        (stick) => !todaySticksData.includes(stick.id)
      );

      setAllSticks(filteredSticksData);
    };

    fetchData();
  }, []);

  const deleteStick = async (stickId) => {
    try {
      await deleteDoc(doc(firestore, "Sticks", stickId));
      setAllSticks((prevSticks) =>
        prevSticks.filter((stick) => stick.id !== stickId)
      );
    } catch (error) {
      console.error("Error deleting stick:", error);
    }
  };

  const updateStick = async () => {
    if (!editedTitle || !editedDate || !editedLocation || !editedDescription) {
      return message.error("Check something you missed");
    }
  
    try {
      const stickRef = doc(firestore, "Sticks", editItemId);
  
      // Convert editedDate to a Firestore Timestamp
      const editedDateTimestamp = new Date(editedDate).toISOString();
  
      const updatedData = {
        title: editedTitle,
        date: editedDateTimestamp, // Use the converted Timestamp
        location: editedLocation,
        description: editedDescription,
      };
  
      await setDoc(stickRef, updatedData, { merge: true });
  
      // Update the local state with the edited data
      setAllSticks((prevSticks) =>
        prevSticks.map((stick) =>
          stick.id === editItemId ? { ...stick, ...updatedData } : stick
        )
      );
  
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating stick:", error);
    }
  };


  
  return (
    <div className="sticks-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
      <h1 style={{ width: '100%', textAlign: 'center' }}>All Sticks (Excluding Today)</h1>
      <div style={{ width: '100%' }}>
        {allSticks.map((card, i) => (
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
            <Button type="danger" icon={<DeleteOutlined />} style={{ color: "red" }} onClick={() => deleteStick(card.id)}></Button>
          </div>
        ))}
      </div>
      <Modal
        title="Edit Stick"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={updateStick}
      >
        <Form>
          <Form.Item>
            <Input
              placeholder="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <DatePicker
              placeholder="Date"
              value={editedDate}
              onChange={(date) => setEditedDate(date)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Location"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
