import AdminHeader from "../components/adminHeader"
import AScreens from "../components/adminScreens"
import NewShow from "../components/NewShowForm"


function addfilmspage() {
    return(
        <div>
            <div>
            <AdminHeader />
            </div>
            <div>
            <NewShow />
            </div>
            <div>
                <AScreens />
            </div>
        </div>



    )
};

export default addfilmspage