import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Select, Tag } from 'antd';
import './DeviceUpdateForm.css';

const { Option } = Select;

interface DeviceUpdateFormProps {
  initialValues: {
    deviceCode: string;
    deviceName: string;
    ipAddress: string;
    deviceType: string;
    username: string;
    password: string;
    services: string[];
  };
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const DeviceUpdateForm = (props:DeviceUpdateFormProps) => {
  const [form] = Form.useForm();
  const [services, setServices] = useState<string[]>(props.initialValues.services);

  const handleRemoveService = (removedService: string) => {
    setServices((prev) => prev.filter((service) => service !== removedService));
  };

  const handleFinish = (values: any) => {
    props.onSubmit({ ...values, services });
  };

  return (
    <div className="device-update-form-container">
      <h2 className="device-update-form-title">Quản lý thiết bị</h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={props.initialValues}
        onFinish={handleFinish}
        className="device-update-form"
      >
        <Row gutter={24}>
          {/* Cột 1 */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="deviceCode"
              label="Mã thiết bị"
              rules={[{ required: true, message: 'Mã thiết bị là bắt buộc' }]}
            >
              <Input placeholder="Nhập mã thiết bị" />
            </Form.Item>
            <Form.Item
              name="deviceName"
              label="Tên thiết bị"
              rules={[{ required: true, message: 'Tên thiết bị là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên thiết bị" />
            </Form.Item>
            <Form.Item
              name="ipAddress"
              label="Địa chỉ IP"
              rules={[
                { required: true, message: 'Địa chỉ IP là bắt buộc' },
                { pattern: /^\d{1,3}(\.\d{1,3}){3}$/, message: 'Địa chỉ IP không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập địa chỉ IP" />
            </Form.Item>
            <Form.Item
              label="Dịch vụ sử dụng"
              required
              className="device-services"
            >
              <div>
                {services.map((service) => (
                  <Tag
                    key={service}
                    closable
                    onClose={() => handleRemoveService(service)}
                    color="orange"
                  >
                    {service}
                  </Tag>
                ))}
              </div>
            </Form.Item>
          </Col>
          {/* Cột 2 */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="deviceType"
              label="Loại thiết bị"
              rules={[{ required: true, message: 'Loại thiết bị là bắt buộc' }]}
            >
              <Select placeholder="Chọn loại thiết bị">
                <Option value="Kiosk">Kiosk</Option>
                <Option value="Display">Display</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Tên đăng nhập là bắt buộc' }]}
            >
              <Input placeholder="Nhập tài khoản" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>
        </Row>
        {/* Nút hành động */}
        <Form.Item>
          <div className="form-actions">
            <Button htmlType="button" onClick={props.onCancel}>
              Hủy bỏ
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DeviceUpdateForm;
