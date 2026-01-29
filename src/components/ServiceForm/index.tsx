import React from 'react';
import { Form, Input, Button, Row, Col, Checkbox } from 'antd';
import './ServiceForm.css';

const ServiceForm: React.FC = () => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log('Form Values:', values);
  };

  return (
    <div className="service-form-container">
      <h2 className="service-form-title">Quản lý dịch vụ</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="service-form"
      >
        <Row gutter={24}>
          {/* Thông tin dịch vụ */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="serviceCode"
              label="Mã dịch vụ"
              rules={[{ required: true, message: 'Mã dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập mã dịch vụ" />
            </Form.Item>
            <Form.Item
              name="serviceName"
              label="Tên dịch vụ"
              rules={[{ required: true, message: 'Tên dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea placeholder="Mô tả dịch vụ" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        {/* Quy tắc cấp số */}
        <div className="rules-section">
          <h3>Quy tắc cấp số</h3>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Form.Item name="autoIncrement">
                <Checkbox>Tăng tự động từ</Checkbox>
              </Form.Item>
              <div className="rule-input-group">
                <Input placeholder="0001" style={{ width: '40%' }} />
                <span className="to-text">đến</span>
                <Input placeholder="9999" style={{ width: '40%' }} />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="prefix">
                <Checkbox>Prefix</Checkbox>
              </Form.Item>
              <Input placeholder="0001" style={{ width: '100%' }} />
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="surfix">
                <Checkbox>Surfix</Checkbox>
              </Form.Item>
              <Input placeholder="0001" style={{ width: '100%' }} />
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="resetDaily">
                <Checkbox>Reset mỗi ngày</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </div>
        {/* Nút hành động */}
        <Form.Item>
          <div className="form-actions">
            <Button htmlType="button">Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ServiceForm;
