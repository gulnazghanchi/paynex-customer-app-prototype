const fs = require('fs');
const file = 'app/dashboard/transactions/order/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `                    {/* Main Detail Grid */}
                    <div className="bg-[#FAFAFA] border border-gray-100 rounded-sm p-8">
                      
                      {/* Transaction Information */}
                      <h2 className="text-[17px] font-bold text-gray-900 mb-8">Transaction Information</h2>
                      <div className="grid grid-cols-3 gap-y-8 gap-x-12 mb-10">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1 flex items-center">Transaction ID</span>
                          <span className="text-[13px] text-gray-900 font-mono flex items-center">
                            {activeTx.transactionId || "-"}
                            <Copy className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1 flex items-center">Dynamic Payment Link ID</span>
                          <span className="text-[13px] text-gray-900 font-mono flex items-center">
                            {activeTx.paymentLinkId || "-"}
                            <Copy className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Transaction Type</span>
                          <span className="text-[13px] text-gray-900">{txTypeStr}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Status</span>
                          <span className={\`text-[13px] font-medium capitalize \${statusStr === 'Approved' ? 'text-green-600' : 'text-red-600'}\`}>{statusStr}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Date & Time</span>
                          <span className="text-[13px] text-gray-900">{activeTx.createdAt ? formatDate(activeTx.createdAt) : "-"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Product</span>
                          <span className="text-[13px] text-gray-900">{activeTx.product?.serialNumber || activeTx.productId || "-"}</span>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <h2 className="text-[17px] font-bold text-gray-900 mb-8 pt-6 border-t border-gray-200">Payment Information</h2>
                      <div className="grid grid-cols-3 gap-y-8 gap-x-12 mb-10">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Amount</span>
                          <span className="text-[13px] text-gray-900">{activeTx.currencySymbol || "CAD$"}{Number(activeTx.amount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Currency</span>
                          <span className="text-[13px] text-gray-900">{activeTx.currency || "CAD"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Payment Provider</span>
                          <span className="text-[13px] text-gray-900">{activeTx.paymentProvider || "Moneris"}</span>
                        </div>
                      </div>

                      {/* Card Information */}
                      <h2 className="text-[17px] font-bold text-gray-900 mb-8 pt-6 border-t border-gray-200">Card Information</h2>
                      <div className="grid grid-cols-3 gap-y-8 gap-x-12 mb-10">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Card Number</span>
                          <span className="text-[13px] text-gray-900 font-mono">{activeTx.maskedCardNumber || "-"}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Card Type</span>
                          <span className="text-[13px] text-gray-900">{activeTx.cardType || "-"}</span>
                        </div>
                      </div>

                      {/* Invoice Information */}
                      <h2 className="text-[17px] font-bold text-gray-900 mb-8 pt-6 border-t border-gray-200">Invoice Information</h2>
                      <div className="grid grid-cols-3 gap-y-8 gap-x-12 mb-10">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1 flex items-center">Invoice Number</span>
                          <span className="text-[13px] text-gray-900 font-mono flex items-center">
                            {activeTx.invoiceNumber || "-"}
                            <Copy className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1">Invoice PDF</span>
                          {activeTx.invoicePdfUrl ? (
                            <a href={activeTx.invoicePdfUrl} target="_blank" rel="noreferrer" className="text-[13px] text-blue-600 hover:text-blue-800 flex items-center font-medium">
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View Invoice
                            </a>
                          ) : (
                            <span className="text-[13px] text-gray-900">-</span>
                          )}
                        </div>
                      </div>

                      {/* Provider Information */}
                      <h2 className="text-[17px] font-bold text-gray-900 mb-8 pt-6 border-t border-gray-200">Provider Information</h2>
                      <div className="grid grid-cols-3 gap-y-8 gap-x-12">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1 flex items-center">Provider Transaction ID</span>
                          <span className="text-[13px] text-gray-900 font-mono flex items-center">
                            {activeTx.providerTnxId || "-"}
                            <Copy className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-gray-500 mb-1 flex items-center">Provider Transaction Number</span>
                          <span className="text-[13px] text-gray-900 font-mono flex items-center">
                            {activeTx.providerTnxNumber || "-"}
                            <Copy className="w-3.5 h-3.5 ml-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </span>
                        </div>
                      </div>
                      
                    </div>`;

const targetStart = '{/* Sections */}';
const targetEnd = '</div>\n                  </>';

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + '\n                  </>' + content.substring(endIndex + targetEnd.length);
  fs.writeFileSync(file, content);
  console.log('Success');
} else {
  console.log('Targets not found', { startIndex, endIndex });
}
