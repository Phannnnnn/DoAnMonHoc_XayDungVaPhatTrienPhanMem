import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import { GetListUser } from '../../ultill/userApi';
import { AuthContext } from '../context/auth.context';

const columns = [
    {
        title: 'Id',
        dataIndex: '_id',
    },
    {
        title: 'Họ tên',
        dataIndex: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
    },
    {
        title: 'Ngày đăng ký',
        dataIndex: 'createdAt',
    },
];

const User = () => {
    const [data, setData] = useState([]);
    const { loading, setLoading } = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        const getListUser = async () => {
            try {
                const res = await GetListUser();
                if (res && Array.isArray(res)) {
                    setData(res);
                } else {
                }
            } catch (error) {
            }
        }
        setLoading(false);
        getListUser();
    }, [])

    return (
        <div>
            {loading === true ?
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}>
                    <Spin />
                </div>
                :
                <Table style={{ padding: 32 }} bordered columns={columns} dataSource={data}
                    rowKey={"_id"}
                />
            }
        </div>
    )



}
export default User;
