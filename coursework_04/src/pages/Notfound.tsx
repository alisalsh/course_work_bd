import { Link } from "react-router-dom";

function notfoundpage() {
    return(
        <div> 404 Not Found
            <Link to="/">Верните меня назад</Link>
        </div>
    )
};

export default notfoundpage