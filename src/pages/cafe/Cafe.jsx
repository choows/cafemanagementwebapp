import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Cafe_API_URL } from '../../utils/Urls';
import { get, post, del, put } from '../../utils/HttpRequest';
import { Button, Modal, Form, Input, Select } from 'antd';
import ActionButtonRender from '../../components/cafe/ActionButtonRender';
import EmployeeCellRender from '../../components/cafe/EmployeeCellRender';
import Locations from '../../utils/Location';
import { useNavigate } from 'react-router-dom';
import {
  PlusOutlined
} from '@ant-design/icons';

ModuleRegistry.registerModules([AllCommunityModule]);

export function Cafe() {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([
    // { field: "id" },
    { field: "name" },
    { field: "location" },
    { field: "description" },
    {
      field: "employees",
      headerName: 'Employees',
      cellRenderer: (params) => <EmployeeCellRender params={params} handleOnClick={handleOnEmployeeClick} />
    },
    {
      field: "actions",
      headerName: 'Actions',
      cellRenderer: (params) => <ActionButtonRender params={params} handleDelete={handleRecordDelete} handleEdit={handleRecordEdit} />
    }
  ]);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState(null);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  };

  useEffect(() => {
    fetchCafeInfo();
  }, []);

  const fetchCafeInfo = async () => {
    const response = await get(Cafe_API_URL);
    const data = response.cafes;
    setRowData(data);
  };

  const handleRecordDelete = async (id) => {
    try {
      const response = await del(Cafe_API_URL, id);
      fetchCafeInfo();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  const handleOnEmployeeClick = (id) => {
    navigate('/employee', { state: { id: id } });
  };
  const handleRecordEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleAddCafe = async (values) => {
    try {
      const response = await post(Cafe_API_URL, values);
      fetchCafeInfo();
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error adding cafe:", error);
    }
  };

  const handleEditCafe = async (values) => {
    try {
      const response = await put(`${Cafe_API_URL}?id=${editingRecord.id}`, values);
      fetchCafeInfo();
      setIsEditModalVisible(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("Error updating cafe:", error);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button
          type="primary"
          onClick={() => setIsAddModalVisible(true)}
          style={{ margin: "10px" }}
          icon={<i className="anticon anticon-plus" />}
        >
          <PlusOutlined />
        </Button>
      </div>
      <div style={{ width: "100%", height: 400 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
        />
      </div>

      {/* Add Cafe Modal */}
      <Modal
        title="Add New Cafe"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCafe}
        >
          <Form.Item
            name="name"
            label="Cafe Name"
            rules={[{ required: true, message: "Please enter the cafe name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter the location" }]}
          >
            <Select
              placeholder="Select a Location"
              options={Locations.map((location) => ({
                label: location.label,
                value: location.value,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter the description" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Cafe Modal */}
      <Modal
        title="Edit Cafe"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => editForm.submit()}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditCafe}
        >
          <Form.Item
            name="name"
            label="Cafe Name"
            rules={[{ required: true, message: "Please enter the cafe name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter the location" }]}
          >
            <Select
              placeholder="Select a Location"
              options={Locations.map((location) => ({
                label: location.label,
                value: location.value,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter the description" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Cafe;