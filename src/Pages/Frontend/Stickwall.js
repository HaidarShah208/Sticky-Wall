import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Modal, message } from "antd";
import FormItem from "antd/es/form/FormItem";
import { PlusCircleOutlined } from "@ant-design/icons"; // Import the Plus icon
import dayjs from "dayjs";
import "./Stickwall.css"; // Import your CSS file
import { firestore } from "../Config/Config";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { Button } from "antd"
import { DeleteOutlined,EditOutlined } from "@ant-design/icons";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat)


const colorList = [
  "#F2A1A1",
  "#FFDDA1",
  "#BEB2F9",
  "#A0E4E8",
  "#FFB5B5",
  "#D2FFA5",
  "#A3D8F2",
  "#F5E7C7",
  "#F8D4E5",
  "#B1E6D1",
  "#FCCDAD",
  "#B3C8D9",
  "#F9B1C4",
  "#C6C9A4",
  "#FFDE59",
  "#80CED7",
  "#FFAF87",
  "#A7D5E1",
  "#9FD8CB",
  "#FFB084",
  "#FFBCBC",
  "#E0E3A1",
  "#C3C3E5",
  "#B5EAD7",
  "#E6A57E",
  "#C3E7DC",
  "#FFB997",
  "#E3D9B7",
  "#B9D4B9",
  "#FFDFD3",
  "#B5D3E7",
  "#F7B2B2"
];


export default function Stickwall() {
  const [sticks, setSticks] = useState([]);
  const [modelVisible, setModelVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [editItemId, setEditItemId] = useState(null); 
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
  const openModal = () => {
    setModelVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "location") {
      setLocation(value);
    } else if (name === "description") {
      setDescription(value);
    }
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const addStick = async () => {
    if (!title || !date || !location || !description) {
      return message.error("Check Something you missed");
    }

    const randomID = Math.random().toString(32).slice(2);
    const randomIndex = Math.floor(Math.random() * colorList.length);

    const newStickData = {
      title: title,
      date: date.toDate(),
      description: description,
      location: location,
      dateCreated: new Date(),
      bgcolor: colorList[randomIndex],
    };

    // Add the new stick data to Firestore collection and get the document reference
    const newStickRef = await addDoc(collection(firestore, "Sticks"), newStickData);

    // Fetch the newly created stick document to update the sticks array
    const newStickDocSnapshot = await getDoc(newStickRef);
    const newStickDocData = newStickDocSnapshot.data();

    // Update the local sticks state with the new stick data
    setSticks((prevSticks) => [...prevSticks, newStickDocData]);
    setModelVisible(false);
    setTitle("");
    setDate(null);
    setLocation("");
    setDescription("");
  };
  
  
  //delete card
  const deleteStick = async (stickId) => {
    await deleteDoc(doc(firestore, "Sticks", stickId));
    setSticks((prevSticks) => prevSticks.filter((stick) => stick.id !== stickId));
  };

  //Edit Card
    const handleEditClick = (card) => {
      setTitle(card.title);
      setDescription(card.description);
      setDate(dayjs(card.date.toDate()));
      setLocation(card.location);
      setEditItemId(card.id);
      setModelVisible(true);
    };
  return (
    <div className=" sticks-container">
      {sticks.map((card, i) => (
        <div style={{ backgroundColor: card.bgcolor, borderRadius: "10px" }} key={i}
          className="card p-3 m-2 fo  sticksCard col-md-3 col-sm-5 col-xl-2 col-xxl-1">
          
          <h5>{card.title}</h5>
          <p>
            <b>
              <u style={{color:'blue'}}>Date</u>
            </b>
          </p><p>{dayjs(card.date.toDate()).format("MM/DD/YYYY")}</p>
          <p>
            <b>
              <u style={{color:'blue'}}>Location</u>
            </b>
          </p>
          <p>{card.location}</p>
          <p>
            <b>
              <u style={{color:'blue'}}>Description</u>
            </b>
          </p>
          <p>{card.description}</p>

          <Button type="primary" icon={<EditOutlined />} style={{ marginLeft: "10px" }} onClick={() => handleEditClick(card)}></Button>
          <Button type="danger" icon={<DeleteOutlined />} style={{ color: "red" }}  onClick={() => deleteStick(card.id)}></Button>
        </div>
      ))}
      <button
        className="card sticksCard p-3 m-3 addButton col-md-3 col-sm-6 col-xl-2 col-xxl-1"onClick={openModal} >
       <PlusCircleOutlined size={50}/>
      </button>
      <Modal
        title="Add Stick"
        visible={modelVisible}
        onCancel={() => setModelVisible(false)}
        onOk={addStick}
      >
        <Form>
          <FormItem>
            <Input
              placeholder="Title"
              value={title}
              onChange={handleChange}
              name="title"
            />
          </FormItem>
          <FormItem>
            <DatePicker
            placeholder="Date"
            value={date}
            onChange={handleDateChange}
            name="date"
            />
          </FormItem>

          <FormItem>
            <Input
              placeholder="Location"
              value={location}
              onChange={handleChange}
              name="location"
            />
          </FormItem>
          <FormItem>
            <Input
              placeholder="Description"
              value={description}
              onChange={handleChange}
              name="description"
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  )
}
