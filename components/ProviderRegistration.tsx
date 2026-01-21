"use client";

import { useState, useEffect } from "react";

interface Category {
  id: string;
  name: string;
}

interface Service {
  name: string;
  price_estimate?: number;
  description?: string;
  category_id: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface Props {
  categories: Category[];
}

export default function ProviderRegistration({ categories }: Props) {
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    username: "",
    email: "",
    phone_number: "",
    city: "",
    description: "",
  });

  const [services, setServices] = useState<Service[]>([
    { name: "", price_estimate: 0, description: "", category_id: "" },
  ]);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [categoryQueries, setCategoryQueries] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const updateBasicInfo = (field: string, value: string) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    setServices([
      ...services,
      { name: "", price_estimate: 0, description: "", category_id: "" },
    ]);
    setCategoryQueries([...categoryQueries, ""]);
  };

  const removeService = (idx: number) => {
    const newServices = [...services];
    const newQueries = [...categoryQueries];
    newServices.splice(idx, 1);
    newQueries.splice(idx, 1);
    setServices(newServices);
    setCategoryQueries(newQueries);
  };

  const showToast = (message: string, type: "success" | "error") => {
    const id = new Date().getTime();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileImage) {
        showToast("Please upload a profile image", "error");
        setLoading(false);
        return;
    }

    if (!idDocument) {
        showToast("Please upload an ID document", "error");
        setLoading(false);
        return;
    }

    setLoading(true);
    try {

        // Trim all text inputs
        const trimmedBasicInfo = {
            name: basicInfo.name.trim(),
            username: basicInfo.username.trim(),
            email: basicInfo.email.trim(),
            phone_number: basicInfo.phone_number.trim(),
            city: basicInfo.city.trim(),
            description: basicInfo.description.trim(),
        };

        if (!trimmedBasicInfo.email || !/^\S+@\S+\.\S+$/.test(trimmedBasicInfo.email)) {
            showToast("Please enter a valid email", "error");
            setLoading(false);
            return;
        }

      const fd = new FormData();
      fd.append("name", trimmedBasicInfo.name);
      fd.append("username", trimmedBasicInfo.username);
      fd.append("email", trimmedBasicInfo.email.trim());
      fd.append("phone_number", trimmedBasicInfo.phone_number);
      fd.append("city", trimmedBasicInfo.city);
      fd.append("description", trimmedBasicInfo.description);
      if (profileImage) fd.append("profileImage", profileImage);
      if (idDocument) fd.append("idDocument", idDocument);
      fd.append("services", JSON.stringify(services));

      const res = await fetch("/api/provider-applications", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast("Application submitted successfully!", "success");

      // **RESET ALL FORM FIELDS**
      setBasicInfo({
        name: "",
        username: "",
        email: "",
        phone_number: "",
        city: "",
        description: "",
      });
      setServices([{ name: "", price_estimate: 0, description: "", category_id: "" }]);
      setCategoryQueries([]);
      setProfileImage(null);
      setIdDocument(null);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Submission failed";
      console.error(err);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center pt-32 min-h-screen px-6 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 mb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Apply as a Service Provider
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Submit your details below. Once approved, your profile will be visible
          to customers.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10" noValidate>
          {/* BASIC INFO */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["name", "username", "email", "phone_number", "city"].map(
                (field, idx) => (
                  <div key={idx} className="relative w-full">
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={basicInfo[field as keyof typeof basicInfo]}
                      onChange={(e) =>
                        updateBasicInfo(field, e.target.value)
                      }
                      required
                      className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      placeholder={field}
                    />
                    <label
                      className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      {field === "phone_number"
                        ? "Phone Number"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                  </div>
                )
              )}
            </div>

            <div className="relative mt-4">
              <textarea
                placeholder="Describe yourself and your experience"
                className="peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 min-h-[180px] resize-y"
                value={basicInfo.description}
                onChange={(e) => updateBasicInfo("description", e.target.value)}
              />
              <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600 peer-focus:text-sm">
                Describe yourself and your experience
              </label>
            </div>
          </section>

          {/* FILE UPLOADS */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Verification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image Upload */}
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-md tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50 text-gray-700">
                <span>{profileImage ? profileImage.name : "Upload Profile Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {/* ID Document Upload */}
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-md tracking-wide border border-gray-300 cursor-pointer hover:bg-gray-50 text-gray-700">
                <span>{idDocument ? idDocument.name : "Upload ID Document"}</span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          </section>

          {/* SERVICES */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Services You Offer
            </h2>

            <div className="space-y-6">
              {services.map((service, idx) => {
                const categoryQuery = categoryQueries[idx] || "";
                const filteredCategories = categories.filter((c) =>
                  c.name.toLowerCase().includes(categoryQuery.toLowerCase())
                );

                return (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-gray-50 relative"
                  >
                    <h3 className="text-lg font-medium mb-2">
                      Service {idx + 1}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[idx].name = e.target.value;
                          setServices(newServices);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    <input
                        type="number"
                        placeholder="Price Estimate"
                        value={service.price_estimate === undefined ? "" : service.price_estimate.toString()}
                        onChange={(e) => {
                            const newServices = [...services];
                            const val = e.target.value;
                            // Allow empty string for deletion
                            newServices[idx].price_estimate = val === "" ? undefined : Number(val);
                            setServices(newServices);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />

                    </div>

                    <textarea
                      placeholder="Description"
                      value={service.description}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[idx].description = e.target.value;
                        setServices(newServices);
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 mt-2"
                    />

                    {/* Category dropdown */}
                    <div className="relative mt-2">
                      <input
                        type="text"
                        placeholder="Type to select category"
                        value={
                          service.category_id
                            ? categories.find((c) => c.id === service.category_id)?.name || ""
                            : categoryQuery
                        }
                        onChange={(e) => {
                          const newQueries = [...categoryQueries];
                          newQueries[idx] = e.target.value;
                          setCategoryQueries(newQueries);

                          const newServices = [...services];
                          newServices[idx].category_id = "";
                          setServices(newServices);
                        }}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                      {categoryQuery && filteredCategories.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded-md max-h-40 overflow-auto mt-1 shadow-lg">
                          {filteredCategories.map((c) => (
                            <li
                              key={c.id}
                              className="p-2 cursor-pointer hover:bg-gray-200"
                              onClick={() => {
                                const newServices = [...services];
                                newServices[idx].category_id = c.id;
                                setServices(newServices);

                                const newQueries = [...categoryQueries];
                                newQueries[idx] = "";
                                setCategoryQueries(newQueries);
                              }}
                            >
                              {c.name}
                            </li>
                          ))}
                        </ul>
                      )}
                        {/* Note for users */}
                        <p className="mt-1 text-sm text-gray-500">
                            💡 If you don&apos;t find an appropriate category for your service, please reach out to us via email.
                        </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="mt-3 text-red-600 hover:underline"
                    >
                      Remove Service
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addService}
              className="mt-6 px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              + Add Another Service
            </button>
          </section>

          {/* SUBMIT */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-lg bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>

        {/* Toasts */}
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-4 py-3 rounded shadow-lg text-white ${
                toast.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
