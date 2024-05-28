import React, { useState, useEffect, ActivityIndicator } from 'react';
import { Upload, Button, message, Image, Typography, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import TextArea from 'antd/es/input/TextArea';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const { Dragger } = Upload;



const Consultation = () => {
  const [imageDescription, setImageDescription] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState();
  const [contextId, setContextId] = useState();
  const [conversationStarted, setConversationStarted] = useState(false);
  const [agentQuestions, setAgentQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState();
  const [currentUserResponse, setCurrentUserResponse] = useState();
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [consolidationInProgress, setConsolidationInProgress] = useState(false);
  const [summary, setSummary] = useState();

  const BASE_URL = "https://dermflowai.azurewebsites.net"
  // const BASE_URL = "http://localhost:8000"
  const props = {
    name: 'file',
    multiple: true,
    action: `${BASE_URL}/upload`,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
        handlePreview(info.file)
      }
      if (status === 'done') {
        if(info.file.response) {
          /**
           * {"success": True, 
                "filename": file.filename, 
                "description": processed_content, 
                "contextId": contextId,
                "question": questions[questionId],
                "questionId": questionId
                }
           */
          const uploadResponse = info.file.response
          // setUploadedFile(info.file)
          // console.log('Result: ', info);
          setImageDescription(uploadResponse.description)
          setContextId(uploadResponse.contextId)
          message.success(`${info.file.name} file uploaded successfully.`);
        } else {
          message.error(`${info.file.name} file uploaded successfully, but failed to fetch description`);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const beginConversation = () => {
      setConversationStarted(true);
      beginDDX();

  }

  const fetchSummary = () => {
    setConsolidationInProgress(true);
    try {
      axios.post(`${BASE_URL}/context?contextId=${contextId}`, {
      }, 
      // , {
      //    headers: {
      //     'Content-Type': "text/json"
      //   }
      // }
      )
      .then((response) => {
          setTimeout(() => {
            const data = response.data
            setConsolidationInProgress(false);
            setContextId(data.contextId);
            console.log(data)
            if(data.summary) {
              setSummary(data.summary);
            } else {
              setSummary("Error occured while fetching summary, please try again!");
            }
          }, 3000)
          // setImageDescription(data.description);
      })
    } catch (error) {
      message.error('Error fetching summary');
      console.error(error);
    }
  }

  const submitResponse = (e) => {
    setRequestInProgress(true);
    try {
      axios.post(`${BASE_URL}/ask?questionId=${currentQuestionId}&contextId=${contextId}&answer=${currentUserResponse}`, {
      }, 
      // , {
      //    headers: {
      //     'Content-Type': "text/json"
      //   }
      // }
      )
      .then((response) => {
          setTimeout(() => {
            userResponses.push(currentUserResponse);
            const data = response.data
            setCurrentUserResponse();
            setRequestInProgress(false);
            setContextId(data.contextId);
            if(data.consolidate) {
              fetchSummary();
            } else {
              setCurrentQuestionId(data.questionId);
              const questions = agentQuestions;
              questions.push(data.question);
              setAgentQuestions(questions);
            }
          }, 3000)
          // setImageDescription(data.description);
      })
    } catch (error) {
      message.error('Error uploading image');
      console.error(error);
    }
  }

  const beginDDX = (e) => {
    setRequestInProgress(true);
    try {
      axios.post(`${BASE_URL}/begin?contextId=${contextId}`, {
      }, 
      // , {
      //    headers: {
      //     'Content-Type': "text/json"
      //   }
      // }
      )
      .then((response) => {
          setTimeout(() => {
            const beginResponse = response.data
            const questions = agentQuestions;
            questions.push(beginResponse.question);
            setAgentQuestions(questions);
            setCurrentQuestionId(beginResponse.questionId)
            setContextId(beginResponse.contextId);
            setRequestInProgress(false);
          }, 3000)
          // setImageDescription(data.description);
      })
    } catch (error) {
      message.error('Error uploading image');
      console.error(error);
    }
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    // setPreviewOpen(true);
  };



  return (
    <div>
    <Dragger {...props}     
>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>
  {previewImage && (
    <div style={{display: 'flex', flexDirection: 'row'}}>
    <div style={{width: '30%'}}>
    <Image
      // wrapperStyle={{ height: '1000', width: '1000' }}
      preview={{
        visible: previewOpen,
        onVisibleChange: (visible) => setPreviewOpen(visible),
        // afterOpenChange: (visible) => !visible && setPreviewImage(''),
      }}
      src={previewImage}
    />
    </div>
    <div style={{width: '70%', justifyContent: 'center', alignContent: 'center', paddingLeft: '50', marginLeft: '500'}}>
    <Typography> {imageDescription} </Typography>
    </div>
    </div>
  )}
  {
    contextId && 
    <Button sx={{margin: "20px 10px;"}} 
      disabled={conversationStarted}
      onClick={beginConversation} 
      variant="contained" color="secondary"> 
      Begin DDX
    </Button>
  }
  {
      requestInProgress && <CircularProgress /> 
  }
  {
    conversationStarted && 
    <div style={{display: 'flex', flexDirection: 'column'}}>
    {agentQuestions.map((question, qIdx) => {
      const answer = userResponses[qIdx];
      return <div key={`d-${qIdx}`} style={{display: 'flex', flexDirection: 'column'}}>
            <Button sx={{margin: "20px 10px;"}} 
            key={`q-${qIdx}`}
      disabled={answer}
      variant="contained" 
      color="secondary"> 
      {question}
    </Button> 
    {
      answer ? <Button sx={{margin: "20px 10px;"}}
      key={`a-${qIdx}`}
      onClick={beginConversation} 
      variant="contained" color="secondary"> 
      {answer}
    </Button> : 
    <div style={{display: 'flex', flexDirection: 'row'}}>
    <Input 
    type="text"
    disabled={requestInProgress}
    placeholder="Enter your response here..."
    onChange={(e) => setCurrentUserResponse(e.target.value)}
    />
    <Button sx={{margin: "20px 10px;"}}
      key='submit-btn' 
      variant="contained" 
      color="primary"
      disabled={!currentUserResponse || currentUserResponse === ''}
      onClick={submitResponse}
      > 
     {requestInProgress ? <CircularProgress /> : 'Submit'}
    </Button> 
    </div>
    }
      </div>
    })}
    </div>
  }
  {
    consolidationInProgress && 
    <div style={{display: 'flex', flexDirection: 'row'}}><CircularProgress /><Typography>Summarizing the conversation</Typography></div>
  }
  {
    summary ?
    <div style={{border: '2px aqua solid', backgroundColor: 'grey',
    alignItems: 'center', padding: '15px'}}>
      <h1> Conversation Summary</h1>
      {summary.split('\n').map((line, i) => {
       return <p key={`l-${i}`}> {line} </p>
      })
    }
    </div> : <></>
  }
  </div>
  );
};

export default Consultation;