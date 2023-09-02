import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../Config/Config';
import { doc, setDoc } from 'firebase/firestore'; // Import firestore related functions
const { Title } = Typography;

export default function Register() {
  const [state, setState] = useState({ fullName: '', email: '', password: '' }); // Added fullName field
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleChange = (e) => setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleRegister = async (e) => {
    e.preventDefault();
    const { fullName, email, password } = state;

    try {
      setIsProcessing(true);

      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        fullName,
        email,
        password
      };
      await setDoc(userDocRef, userData);

      message.success('User registered successfully');
      setIsProcessing(false);
    } catch (error) {
      message.error('Registration failed');
      setIsProcessing(false);
    }
  

  };

  return (
    <main className="auth">
      <div className="container" style={{ textAlign: 'center', width: '50%', margin: '0 auto' }}>
        <div className="row">
          <div className="col">
            <div className="card p-3 p-md-4">
              <Title level={2} className="m-0 text-center">
                Register Your Self
              </Title>

              <Form layout="vertical">
                <Form.Item label="Full Name">
                  {/* Add input for full name */}
                  <Input placeholder="Input your full name" name="fullName" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Email">
                  <Input placeholder="Input your email" name="email" onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Password">
                  <Input.Password placeholder="Input your password" name="password" onChange={handleChange} />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-100"
                  loading={isProcessing}
                  onClick={handleRegister}
                >
                  Register
                </Button>
                {/* Update href to the appropriate route */}
                <a className="w-100" style={{ margin: '20px', padding: '10px' }} href="/auth/login">
                  Go To login page
                </a>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
