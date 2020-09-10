import * as React from "react";

import { Modal, Button } from "antd";
import "./App.less";

const App: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  const handleCloseModal = () => {
    setVisible(false);
  };
  return (
    <div className="App">
      <p>Hello React</p>
      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        点我
      </Button>

      <Modal
        visible={visible}
        onCancel={handleCloseModal}
        onOk={handleCloseModal}
        title="我是一个弹窗"
      >
        弹窗内容
      </Modal>
    </div>
  );
};

export default App;
