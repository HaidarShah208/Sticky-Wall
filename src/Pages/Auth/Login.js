import React, { useState } from 'react';
import { Button, Form, Input, Typography, Modal, message } from 'antd';
import { useAuthContext } from '../contexts/AuthContext';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../Config/Config';

const { Title } = Typography;

export default function Login() {
  const { dispatch } = useAuthContext();
  const [state, setState] = useState({ fullName: "", email: "", password: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleLogin = e => {
    e.preventDefault();
    e.preventDefault()
    let {fullName, email, password } = state    
    const user = { fullName, email, password }
    setIsProcessing(true)
  signInWithEmailAndPassword(auth,email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log("user login Sucessfully")
    message.success('user login Sucessfully');
      console.log(userCredential)
      console.log(userCredential.user)

      dispatch({ type: "SET_LOGGED_IN", payload: { user } })
        setIsProcessing(false)
    
        // ...
    })
    .catch((error) => {
      message.error('You are Not Register');
      const errorCode = error.code;
      const errorMessage = error.message;
      setIsProcessing(false)
    });
    
 
    
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handlePasswordReset = () => {
    if (!resetEmail) {
      message.error("Please enter your email to reset the password");
      return;
    }

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        message.success("Password reset email sent. Please check your inbox.");
        setResetEmail("");
        setIsModalVisible(false);
      })
      .catch((error) => {
        message.error("Error sending password reset email: " + error.message);
      });
  };

  return (
    <main className="auth">
      <div className="container" style={{ textAlign: 'center', width: '50%', margin: '0 auto' }}>
        <div className="row">
          <div className="col">
            <div className="card p-3 p-md-4">
              <Title level={2} className='m-0 text-center'>Login Now</Title>
              <Form layout="vertical">
                <Form.Item label="Email">
                  <Input placeholder='Input your email' name='email' onChange={handleChange} />
                </Form.Item>
                <Form.Item label="Password">
                  <Input.Password placeholder='Input your password' name='password' onChange={handleChange} />
                </Form.Item>
                <Button type='primary' htmlType='submit' className='w-100' loading={isProcessing} onClick={handleLogin}>
                  Click to Login Now
                </Button>
                <p><span>Don't have an account</span></p>
                <a className='w-100'  style={{ margin: '20px', padding: '10px' }} href='/register'>
                  Go To Register page
                </a>
                <Button type="default" onClick={showModal}>
                  Forgot Password?
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Reset Password"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="reset" type="primary" onClick={handlePasswordReset}>
            Reset Now
          </Button>,
        ]}
      >
        <Form>
          <Form.Item label="Email">
            <Input
              placeholder="Enter your email"
              value={resetEmail}
              onChange={e => setResetEmail(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
