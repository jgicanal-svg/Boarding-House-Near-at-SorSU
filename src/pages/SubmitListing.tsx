import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, PlusCircle, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import { submitListing } from '../services/api';

export const SubmitListing: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [ownerName, setOwnerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [messengerUrl, setMessengerUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('');
  const [address, setAddress] = useState('Zone VIII Poblacion (Barangay 8 - Loyo), Bulan, Sorsogon');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(['Wi-Fi', 'Water Included']);
  const [photoUrl, setPhotoUrl] = useState('');

  const allFacilities = [
    'Wi-Fi', 'Water Included', 'Kitchen Access', 'Study Area', 
    'Aircon', 'Private Bathroom', 'Laundry Area', 'CCTV Security', 'Bicycle Parking'
  ];

  const handleFacilityToggle = (fac: string) => {
    if (selectedFacilities.includes(fac)) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== fac));
    } else {
      setSelectedFacilities([...selectedFacilities, fac]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ownerName || !contactInfo || !name || !monthlyPrice || !address) {
      setError('Please fill in all required owner and listing details.');
      return;
    }

    setSubmitting(true);
    try {
      await submitListing({
        owner_name: ownerName,
        contact_information: contactInfo,
        messenger_url: messengerUrl,
        name,
        description,
        monthly_price: Number(monthlyPrice),
        address,
        facilities: selectedFacilities,
        photos: photoUrl ? [photoUrl, '/src/assets/images/student_room_interior_1793166105502.jpg'] : ['/src/assets/images/student_room_interior_1793166105502.jpg']
      });
      setSuccess(true);
      setSubmitting(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to submit listing');
      } else {
        setError('Failed to submit listing');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 space-y-8">
          
          <div className="space-y-2 border-b border-zinc-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-[#800000] text-xs font-bold border border-amber-300">
              <ShieldCheck className="w-4 h-4 text-[#800000]" />
              SSU Bulan Campus Verifier Submission
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Submit Boarding House Listing</h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              New submissions are assigned <strong className="text-zinc-900">AWAITING_VERIFICATION</strong> status and remain hidden from public feed until personally verified by our campus team.
            </p>
          </div>

          {success ? (
            <div className="bg-amber-50 border border-amber-300 p-8 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-[#800000] mx-auto" />
              <h3 className="text-lg font-bold text-amber-950">Listing Submitted Successfully!</h3>
              <p className="text-xs sm:text-sm text-zinc-700 max-w-md mx-auto leading-relaxed">
                Thank you, {ownerName}. Your boarding house <strong>{name}</strong> is now awaiting physical verification by our Technologia team verifiers in Bulan.
              </p>
              <div className="pt-4 flex justify-center gap-4">
                <Link
                  to="/"
                  className="px-6 py-2.5 bg-[#800000] text-amber-300 text-xs font-bold rounded-xl hover:bg-[#660000] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 text-rose-700 text-xs">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Owner Information */}
              <div className="space-y-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200/60">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">1. Owner / Agent Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Owner / Manager Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aling Maria Gicanal"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Contact Number (Mobile) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 09123456789"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Facebook Messenger Profile URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://m.me/yourprofile"
                    value={messengerUrl}
                    onChange={(e) => setMessengerUrl(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                  <p className="text-[11px] text-zinc-500">Allows SSU students to contact you directly via Facebook Messenger.</p>
                </div>
              </div>

              {/* Listing Details */}
              <div className="space-y-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200/60">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">2. Boarding House Details</h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Boarding House / Dormitory Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bulan Sunrise Dormitory"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Monthly Rental Price (PHP) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1500"
                      value={monthlyPrice}
                      onChange={(e) => setMonthlyPrice(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Complete Address / Zone in Bulan *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zone VIII Poblacion (Barangay 8 - Loyo), Bulan, Sorsogon"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Description & Rules</label>
                  <textarea
                    rows={4}
                    placeholder="Describe rooms, capacity, curfew rules, distance to SSU Bulan campus..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  ></textarea>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200/60">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">3. Facilities & Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allFacilities.map(fac => {
                    const isChecked = selectedFacilities.includes(fac);
                    return (
                      <button
                        key={fac}
                        type="button"
                        onClick={() => handleFacilityToggle(fac)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-colors ${isChecked ? 'bg-[#800000]/10 border-[#800000] text-[#800000] font-bold' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'}`}
                      >
                        <span>{fac}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-[#800000]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Photo URL */}
              <div className="space-y-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-200/60">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">4. Photo URL (Optional)</h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Photo Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or leave blank for default student room photo"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#800000]"
                  />
                  <p className="text-[11px] text-zinc-500">Our verifier will also take official inspection photos during the campus visit.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#800000] hover:bg-[#660000] text-amber-300 font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-amber-400/40"
              >
                <PlusCircle className="w-5 h-5 text-amber-300" />
                {submitting ? 'Submitting Listing...' : 'Submit Listing for Verification'}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
