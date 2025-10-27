import { useState, useEffect } from "react";
import { Save, X, Loader2 } from "lucide-react";
import { api } from '../services/api';
import { ProfileInput } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';

export default function BasicInformation() {
	const [formData, setFormData] = useState<ProfileInput>({
		firstName: "",
		middleName: "",
		lastName: "",
		phone: "",
		city: "",
		state: "",
		jobTitle: "",
		bio: "",
		industry: "",
		expLevel: "",
	});

	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [charCount, setCharCount] = useState(0);

	const industries = [
		"Technology", 
		"Finance", 
		"Healthcare",
		"Education",
		"Marketing",
		"Other",
	];

	const experienceLevels = ["Entry", "Mid", "Senior"];

	// Load existing profile data on component mount
	useEffect(() => {
		loadProfile();
	}, []);

	const loadProfile = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await api.getProfile();
			if (response.data?.profile) {
				const profile = response.data.profile;
				setFormData({
					firstName: profile.first_name || "",
					middleName: profile.middle_name || "",
					lastName: profile.last_name || "",
					phone: profile.phone || "",
					city: profile.city || "",
					state: profile.state || "",
					jobTitle: profile.job_title || "",
					bio: profile.bio || "",
					industry: profile.industry || "",
					expLevel: profile.exp_level || "",
				});
				setCharCount(profile.bio?.length || 0);
			}
		} catch (err) {
			// If profile doesn't exist, that's okay - user can create one
			console.log("No existing profile found, user can create one");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		if (name === "bio") {
			if (value.length <= 500) {
				setFormData({ ...formData, [name]: value });
				setCharCount(value.length); 
			}
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.firstName || !formData.lastName || !formData.state) {
			setError("Please fill in all required fields (First Name, Last Name, State)."); 
			return;
		}

		try {
			setSaving(true);
			setError(null);
			await api.createOrUpdateProfile(formData);
			setMessage("Profile saved successfully");
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to save profile');
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		loadProfile(); // Reload original data
		setMessage(null);
		setError(null);
	};

	if (loading) {
		return (
			<div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">
				<div className="text-center py-20">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading profile...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-gray-800 mb-4">Basic Information</h1>
				<p className="text-lg text-gray-600">Manage your personal details and contact information</p>
			</div>

			{/* Message Display */}
			{message && (
				<div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
					{message}
					<button 
						onClick={() => setMessage(null)}
						className="ml-2 text-green-600 hover:text-green-800"
					>
						<X className="h-4 w-4 inline" />
					</button>
				</div>
			)}

			{/* Error Display */}
			{error && (
				<div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
					{error}
					<button 
						onClick={() => setError(null)}
						className="ml-2 text-red-600 hover:text-red-800"
					>
						<X className="h-4 w-4 inline" />
					</button>
				</div>
			)}

			<div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-2xl">
				<h2 className="text-2xl font-semibold mb-6">Professional Profile</h2>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="firstName">First Name *</Label>
							<Input
								id="firstName"
								type="text"
								name="firstName"
								placeholder="First Name"
								value={formData.firstName}
								onChange={handleChange}
								className="mt-1"
								required
							/>
						</div>
						<div>
							<Label htmlFor="lastName">Last Name *</Label>
							<Input
								id="lastName"
								type="text"
								name="lastName"
								placeholder="Last Name"
								value={formData.lastName}
								onChange={handleChange}
								className="mt-1"
								required
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="middleName">Middle Name</Label>
						<Input
							id="middleName"
							type="text"
							name="middleName"
							placeholder="Middle Name (Optional)"
							value={formData.middleName}
							onChange={handleChange}
							className="mt-1"
						/>
					</div>

					<div>
						<Label htmlFor="phone">Phone Number</Label>
						<Input
							id="phone"
							type="tel"
							name="phone"
							placeholder="Phone Number"
							value={formData.phone}
							onChange={handleChange}
							className="mt-1"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="city">City</Label>
							<Input
								id="city"
								type="text"
								name="city"
								placeholder="City"
								value={formData.city}
								onChange={handleChange}
								className="mt-1"
							/>
						</div>
						<div>
							<Label htmlFor="state">State *</Label>
							<Input
								id="state"
								type="text"
								name="state"
								placeholder="State (e.g., CA, NY)"
								value={formData.state}
								onChange={handleChange}
								className="mt-1"
								maxLength={2}
								required
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="jobTitle">Job Title</Label>
						<Input
							id="jobTitle"
							type="text"
							name="jobTitle"
							placeholder="Professional Job Title"
							value={formData.jobTitle}
							onChange={handleChange}
							className="mt-1"
						/>
					</div>

					<div>
						<Label htmlFor="bio">Bio</Label>
						<textarea
							id="bio"
							name="bio"
							placeholder="Brief Bio (max 500 characters)"
							value={formData.bio}
							onChange={handleChange}
							className="w-full border border-gray-300 p-3 rounded-md mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							rows={4}
						/>
						<div className="text-sm text-gray-500 text-right mt-1">
							{charCount}/500
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="industry">Industry</Label>
							<Select
								id="industry"
								name="industry"
								value={formData.industry}
								onChange={handleChange}
								className="mt-1"
							>
								<option value="">Select Industry</option>
								{industries.map((industry) => (
									<option key={industry} value={industry}>
										{industry}
									</option>
								))}
							</Select>
						</div>
						<div>
							<Label htmlFor="expLevel">Experience Level</Label>
							<Select
								id="expLevel"
								name="expLevel"
								value={formData.expLevel}
								onChange={handleChange}
								className="mt-1"
							>
								<option value="">Select Experience Level</option>
								{experienceLevels.map((level) => (
									<option key={level} value={level}>
										{level}
									</option>
								))}
							</Select>
						</div>
					</div>

					<div className="flex justify-end space-x-3 pt-6">
						<Button 
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={saving}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={saving}
							className="bg-blue-600 hover:bg-blue-700 text-white"
						>
							{saving ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Saving...
								</>
							) : (
								<>
									<Save className="h-4 w-4 mr-2" />
									Save Profile
								</>
							)}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
