import { Button, Result } from "antd";
import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Esta página no existe."
      extra={<Button type="primary" onClick={() => navigate("/")}>Ir al inicio</Button>}
    />
  );
}
