/* 
export function BasicInformation() {
  return (
    <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Basic Information</h1>
        <p className="text-lg text-gray-600">This is the Basic Information page</p>
        <p className="text-sm text-gray-500 mt-2">Manage your personal details and contact information</p>
      </div>
    </div>
  )
}
*/

import { useState } from "react"; 

export default function ProfileForm () {
	const [formData, setFormData] = useState({
		fullName: "", 
		email: "", 
		phone: "", 
		location: "", 
		headline: "", 
		bio: "", 
		industry: "", 
		experience: "", 
	});

	const [charCount, setCharCount] = useState(0);
	const [message, setMessage] = useState("");

	const industries = [
		"Technology", 
		"Finance", 
		"Healthcare",
		"Education",
		"Marketing",
		"Other",
	];

	const experienceLevels = ["Entry", "Mid", "Senior", "Executive"];

	const handleChange = (e) => {
		const { name,  value } = e.target;

		if (name === "bio") {
			if (value.length <= 500) {
				setFormData({ ...formData, [name]: value });
				setCharCount(value.length); 
			}
		}  else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!formData.fullName || !formData.email ||  !formData.phone || !formData.location) {
			setMessage("Please fill in all required fields."); 
			return;
		
		}

		// to edit later
		console.log("Saved profile:", formData);
		setMessage("Profile saved successfully"); 
	};

	const handleCancel = () => {
		setFormData({
			fullName: "",
			email: "", 
			phone: "",
			location: "",  
			headline: "", 
			bio: "", 
			industry: "",
			experience: "",
		});
		setCharCount(0); 
		setMessage("Changes canceled");
	};

	return (
		<div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
			<h2 className="text-2xl font-semibold mb-4">Create Your Professional Profile</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					name="fullName"
					placeholder="Full Name*"
					value={formData.fullName}
					onChange={handleChange}
					className="w-full border p-2 rounded"
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email*"
					value={formData.email}
					onChange={handleChange}
					className="w-full border p-2 rounded"
					required
				/>
				<input
					type="text"
					name="location"
					placeholder="Location (City, State)*"
					value={formData.location}
					onChange={handleChange}
					className="w-full border p-2 rounded"
				/>
				<input
					type="text"
					name="headline"
					placeholder="Professional Headline"
					value={formData.headLine}
					onChange={handleChange}
					className="w-full border p-2 rounded"
				/>
				<div>
					<textarea
						name="bio"
						placeholder="Brief Bio (max 500 characters)"
						value={formData.bio}
						onChange={handleChange}
						className="w-full border p-2 rounded"
						rows="4"
					/>
					<div className="text-sm text-gray-500 text-right">
						{charCount}/500
					</div>
				</div>
				<select
					name="industry"
					value={formData.industry}
					onChange={handleChange}
					className="w-full border p-2 rounded"
				>
					<option value="">Select Industry</option>
					{industries.map((ind) =>(
						<option key={ind} value={ind}>
							{ind}
						</option>
					))}
				</select>
				<select
					name="experience"
					value={formData.experience}
					onChange={handleChange}
					className="w-full border p-2 rounded"
				>
					<option value="">Experience Level</option>
					{experienceLevels.map((lvl) => (
						<option key={lvl} value={lvl}>
							{lvl}
						</option>
					))}
				</select>

				<div  className="flex justify-end space-x-3 pt-4">
					<button 
						type="button"
						onClick={handleCancel}
						className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
					>
						Save
					</button>
				</div>
			</form>

			{message &&(
				<div className="mt-4 text-center text-sm text-gray-700">{message}</div>
			)}
		</div>
	);
}
