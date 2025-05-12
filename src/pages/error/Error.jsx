import { useRouteError } from "react-router-dom";
import { Result, Button } from "antd";

function ErrorPage() {
    const error = useRouteError();

    return (
        <div id="error-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Result
                status="500"
                title="Oops!"
                subTitle={error?.statusText || "Sorry, an unexpected error has occurred."}
                extra={
                    <Button type="primary" onClick={() => window.location.href = "/"}>
                        Back to Home
                    </Button>
                }
            />
        </div>
    );
}

export default ErrorPage;