import React, { useState } from 'react';
import { Input, Button, Typography, Card, message } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const App: React.FC = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const runCommand = async () => {
    if (!command.trim()) {
      message.warning('Please enter a command');
      return;
    }

    setLoading(true);
    setOutput('');

    try {
      const response = await axios.post('http://localhost:8080/api/shell/execute', {
        command,
      });

      // ✅ Safely get output string
      setOutput(response.data.output || 'No output received');
    } catch (error: any) {
      if (error.response) {
        setOutput(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        setOutput("Error: No response received from server");
      } else {
        setOutput("Error executing command: " + error.message);
      }
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20 }}>
      <Title level={2}>Shell Task Runner</Title>
      <TextArea
        rows={3}
        placeholder="Enter shell command here"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
      />
      <Button type="primary" onClick={runCommand} loading={loading} style={{ marginTop: 10 }}>
        Run Command
      </Button>

      {output && (
        <Card title="Command Output" style={{ marginTop: 20 }}>
          <Paragraph>
            <pre>{output}</pre>
          </Paragraph>
        </Card>
      )}
    </div>
  );
};

export default App;
