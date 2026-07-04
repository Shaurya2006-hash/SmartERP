"use client";

const shortcuts = [
  {
    title: "Global",
    data: [
      ["Ctrl+Alt+C", "Company Selection"],
      ["Ctrl+Alt+Y", "Financial Year"],
      ["Ctrl+Alt+I", "Company Information"],
      ["Ctrl+Alt+X", "Calculator"],
      ["Ctrl+Alt+R", "Refresh"],
      ["Alt+←", "Previous Screen"],
      ["Ctrl+Shift+Q", "Logout"],
      ["Ctrl+Alt+H", "Home"],
      ["Ctrl+Alt+K", "Command Search"],
    ],
  },
  {
    title: "Masters",
    data: [
      ["Alt+C", "Create Company"],
      ["Alt+G", "Create Group"],
      ["Alt+L", "Create Ledger"],
      ["Alt+Shift+L", "Edit Ledger"],
      ["Alt+S", "Create Stock Item"],
      ["Alt+U", "Create Unit"],
      ["Alt+D", "Create Godown"],
    ],
  },
  {
    title: "Vouchers",
    data: [
      ["Ctrl+Alt+P", "Purchase Voucher"],
      ["Ctrl+Alt+S", "Sales Voucher"],
      ["Ctrl+Alt+T", "Receipt Voucher"],
      ["Ctrl+Alt+J", "Journal Voucher"],
      ["Ctrl+Alt+V", "Reversing Journal"],
      ["Ctrl+Alt+N", "Credit Note"],
      ["Ctrl+Alt+D", "Debit Note"],
    ],
  },
  {
    title: "Billing",
    data: [
      ["Ctrl+B", "New Invoice"],
      ["Ctrl+P", "Print Invoice"],
      ["Ctrl+Shift+P", "Download PDF"],
      ["Ctrl+S", "Save"],
      ["Ctrl+Shift+X", "Cancel"],
    ],
  },
  {
    title: "Search",
    data: [
      ["Ctrl+F", "Search"],
      ["Ctrl+Shift+F", "Global Search"],
      ["Enter", "Select"],
      ["Tab", "Next Field"],
      ["Shift+Tab", "Previous Field"],
      ["Arrow Keys", "Navigation"],
      ["Esc", "Cancel"],
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
              key={`${section.title}-${key}-${value}`}
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
