import { useState, useEffect } from 'react';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Cafe_API_URL, Employee_API_URL } from '../../utils/Urls';
import { get, post, del, put } from '../../utils/HttpRequest';
import { Button, Modal, Form, Input, Select, DatePicker } from 'antd';
import ActionButtonRender from '../../components/cafe/ActionButtonRender';
import { useNavigate, useLocation } from 'react-router-dom';
import moment from "moment";
import Gender from '../../utils/Gender.json';
import {
  PlusOutlined
} from '@ant-design/icons';

ModuleRegistry.registerModules([AllCommunityModule]);

export function Employee() {
    const { state } = useLocation();
    const { id } = state ;
    const [rowData, setRowData] = useState([]);
    const [cafes, setCafes] = useState([]);
    const [colDefs, setColDefs] = useState([
        { field: "id" },
        { field: "name" },
        { field: "email_address" },
        { field: "phone_number" },
        { field: "day_worked" },
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
        fetchEmployeeInfo();
        fetchCafeInfo();
    }, []);

    const fetchEmployeeInfo = async () => {
        const response = id == null ? await get(Employee_API_URL) : await get(`${Employee_API_URL}?cafe=${id}`);
        const data = response.employees;
        setRowData(data);
    };

    const fetchCafeInfo = async () => {
        const response = await get(Cafe_API_URL);
        let data = response.cafes;
        if (id != null) {
            data = data.filter(getCurrentCafeFromList);
        }
        setCafes(data);
    };

    const getCurrentCafeFromList = (cafe) => {
        return cafe.id == id;
    }
    const handleRecordDelete = async (id) => {
        try {
            const response = await del(Employee_API_URL, id);
            fetchEmployeeInfo();
        } catch (error) {
            console.error("Error deleting record:", error);
        }
    };
    const handleRecordEdit = (record) => {
        setEditingRecord(record);
        editForm.setFieldsValue(record);
        editForm.setFieldValue("start_date", moment(record.start_date));
        setIsEditModalVisible(true);
    };

    const handleAddEmployee = async (values) => {
        try {
            const response = await post(Employee_API_URL, values);
            fetchEmployeeInfo();
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("Error adding employee:", error);
        }
    };

    const handleEditEmployee = async (values) => {
        try {
            const response = await put(`${Employee_API_URL}?id=${editingRecord.id}`, values);
            fetchEmployeeInfo();
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
          <PlusOutlined/>
        </Button>
      </div>
            <div style={{ width: "100%", height: 500 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                />
            </div>

            {/* Add Employee Modal */}
            <Modal
                title="Add New Employee"
                visible={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddEmployee}
                >
                    <Form.Item
                        name="name"
                        label="Employee Name"
                        rules={[{ required: true, message: "Please enter the employee name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email_address"
                        label="Email Address"
                        rules={[
                            { required: true, message: "Please enter the email address" },
                            {
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address"
                            }
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                        rules={[{ required: true, message: "Please enter the phone number" }, {
                            pattern: /^[89]\d{7}$/,
                            message: "Please enter a valid phone number"
                        }]}
                    >
                        <Input type='numeric'/>
                    </Form.Item>
                    <Form.Item
                        name="start_date"
                        label="Start Date"
                        rules={[{ required: true, message: "Please select the start date" }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: "Please select the gender" }]}
                    >
                        <Select
                            placeholder="Select a Gender"
                            options={Gender.map((gender) => ({
                                label: gender.label,
                                value: gender.value,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="cafeId"
                        label="Cafe"
                        rules={[{ required: (id != null), message: "Please select the gender" }]}
                    >
                        <Select
                            placeholder="Select a Cafe"
                            options={cafes.map((cafe) => ({
                                label: cafe.name,
                                value: cafe.id,
                            }))}
                        />
                    </Form.Item>

                </Form>
            </Modal>

            {/* Edit Employee Modal */}
            <Modal
                title="Edit Employee"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={() => editForm.submit()}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditEmployee}
                >
                    <Form.Item
                        name="name"
                        label="Employee Name"
                        rules={[{ required: true, message: "Please enter the employee name" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email_address"
                        label="Email Address"
                        rules={[
                            { required: true, message: "Please enter the email address" },
                            {
                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address"
                            }
                        ]}
                    >
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                        rules={[{ required: true, message: "Please enter the phone number" }, {
                            pattern: /^[89]\d{7}$/,
                            message: "Please enter a valid phone number"
                        }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="start_date"
                        label="Start Date"
                        rules={[{ required: true, message: "Please select the start date" }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: "Please select the gender" }]}
                    >
                        <Select
                            placeholder="Select a Gender"
                            options={Gender.map((gender) => ({
                                label: gender.label,
                                value: gender.value,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item
                        name="cafeId"
                        label="Cafe"
                        rules={[{ required: (id != null), message: "Please select the gender" }]}
                    >
                        <Select
                            placeholder="Select a Cafe"
                            options={cafes.map((cafe) => ({
                                label: cafe.name,
                                value: cafe.id,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Employee;