const EmployeeCellRender = (params) => {
    return (
        <div onClick={() => { params.handleOnClick(params.params.node.data.id) }}>
            <label>{params.params.node.data.employees}</label>
        </div>

    );
};
export default EmployeeCellRender;  