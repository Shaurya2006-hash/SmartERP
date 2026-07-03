"use client";

const shortcuts = [
  {
    title: "Global",
    data: [
      ["F1", "Company Selection"],
      ["F2", "Financial Year"],
      ["F3", "Company Info"],
      ["F4", "Calculator"],
      ["F5", "Refresh"],
      ["Esc", "Back"],
      ["Ctrl+Q", "Logout"],
      ["Ctrl+H", "Home"],
      ["Ctrl+K", "Command Search"],
    ],
  },
  {
    title: "Masters",
    data: [
      ["Alt+L", "Create Ledger"],
      ["Alt+A", "Alter Ledger"],
      ["Alt+G", "Create Group"],
      ["Alt+S", "Stock Item"],
      ["Alt+U", "Create Unit"],
    ],
  },
  {
    title: "Vouchers",
    data: [
      ["F6", "Receipt"],
      ["F7", "Journal"],
      ["F8", "Sales"],
      ["F9", "Purchase"],
      ["F10", "Reversing Journal"],
      ["Alt+F8", "Credit Note"],
      ["Alt+F9", "Debit Note"],
    ],
  },
  {
    title: "Billing",
    data: [
      ["Ctrl+B", "New Invoice"],
      ["Ctrl+P", "Print Invoice"],
      ["Ctrl+Shift+P", "Download PDF"],
    ],
  },
  {
    title: "Search",
    data: [
      ["Ctrl+F", "Search"],
      ["Ctrl+Shift+F", "Global Search"],
      ["Enter", "Select"],
      ["Tab", "Next Field"],
      ["Arrow", "Navigate"],
    ],
  },
];

export default function ShortcutPanel() {
  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-gray-900 text-white overflow-y-auto shadow-xl">

      <div className="sticky top-0 bg-blue-700 p-4 text-xl font-bold">
        Keyboard Shortcuts
      </div>

      {shortcuts.map((section) => (

        <div key={section.title} className="border-b border-gray-700">

          <h2 className="bg-gray-800 p-3 font-bold">
            {section.title}
          </h2>

          {section.data.map(([key, value]) => (

            <div
              key={key}
              className="flex justify-between px-4 py-2 hover:bg-gray-800"
            >

              <span className="font-semibold text-green-400">
                {key}
              </span>

              <span>{value}</span>

            </div>

          ))}

        </div>

      ))}

    </div>
  );
}