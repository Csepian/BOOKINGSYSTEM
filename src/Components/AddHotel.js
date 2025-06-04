import React from "react";
import axios from "axios";

const AddHotel = () => {
    const [formData, setFormData] = React.useState({
        name: "",
        location: "",
        managerID: "",
        amenities: "",
    });
    const [errorMessage, setErrorMessage] = React.useState({});
    const [message, setMessage] = React.useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const response = await axios.post('https://localhost:7125/api/Hotels', formData);
            console.log(response.data);
            setMessage(`Hotel ${response.data.name} added successfully!`);
            setFormData({
                name: "",
                location: "",
                managerID: 0,
                amenities: "",
            });
            setErrorMessage({});
        } catch (error) {
            console.error("Error Adding Hotel:", error);
            setMessage("Error Adding Hotel: " + error.message);
        }
    };

    const validate = () => {
        let isValid = true;
        const errors = {};
        if (!formData.name) {
            errors.name = "Name is required";
            isValid = false;
        }
        if (!formData.location) {
            errors.location = "Location is required";
            isValid = false;
        }
        if (!formData.managerID) {
            errors.managerID = "Manager ID is required";
            isValid = false;
        }
        if (!formData.amenities) {
            errors.amenities = "Amenities is required";
            isValid = false;
        }
        setErrorMessage(errors);
        return isValid;
    };

    return (

            <div
                style={{
                    maxWidth: "600px",
                    margin: "40px auto",
                    padding: "20px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#fff",
                }}
            >
                <form className="row g-4" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Hotel Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errorMessage.name && <span className="text-danger">{errorMessage.name}</span>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="amenities" className="form-label">Amenities</label>
                        <input
                            type="text"
                            className="form-control"
                            id="amenities"
                            value={formData.amenities}
                            onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                        />
                        {errorMessage.amenities && <span className="text-danger">{errorMessage.amenities}</span>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="managerID" className="form-label">Manager ID</label>
                        <input
                        type ="text"
                            className="form-control"
                            id="managerID"
                            value={formData.managerID}
                            onChange={(e) => setFormData({ ...formData, managerID: e.target.value })}
                        >
                        </input>
                        {errorMessage.managerID && <span className="text-danger">{errorMessage.managerID}</span>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                        type ="text"
                            className="form-control"
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        >
                        </input>
                        {errorMessage.location && <span className="text-danger">{errorMessage.location}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>

    );
};

export default AddHotel;