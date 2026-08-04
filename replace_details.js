const fs = require('fs');
const file = 'app/dashboard/transactions/order/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `                    {/* Sections */}
                    <div className="flex flex-col space-y-8 mt-12">
                      
                      {/* Transaction Information */}
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-800 mb-3">Transaction Information</h3>
                        <div className="bg-[#F8F9FA] border border-gray-200 rounded-md shadow-sm">
                          
                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Transaction ID</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium font-mono">
                              <Copy className="w-4 h-4 mr-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                              {activeTx.transactionId || "-"}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Dynamic Payment Link ID</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium font-mono">
                              <Copy className="w-4 h-4 mr-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                              {activeTx.paymentLinkId || "-"}
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Transaction Type</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              {txTypeStr}
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Status</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              <span className={\`px-2 py-[2px] rounded-full border text-[11px] font-bold uppercase tracking-wider \${statusStr === 'Approved' ? 'border-green-500 text-green-600 bg-green-50' : 'border-red-500 text-red-600 bg-red-50'}\`}>
                                {statusStr}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Date & Time</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              {activeTx.createdAt ? formatDate(activeTx.createdAt) : "-"}
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-3 px-4">
                            <span className="text-[13px] text-gray-500 font-medium">Product</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              {activeTx.product?.serialNumber || activeTx.productId || "-"}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Payment Information */}
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-800 mb-3">Payment Information</h3>
                        <div className="bg-[#F8F9FA] border border-gray-200 rounded-md shadow-sm">
                          
                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Amount</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              {activeTx.currencySymbol || "CAD$"}{Number(activeTx.amount || 0).toFixed(2)}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Currency</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              {activeTx.currency || "CAD$"}
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-3 px-4">
                            <span className="text-[13px] text-gray-500 font-medium">Payment Provider</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              {activeTx.paymentProvider || "Moneris"}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Card Information */}
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-800 mb-3">Card Information</h3>
                        <div className="bg-[#F8F9FA] border border-gray-200 rounded-md shadow-sm">
                          
                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Card Number</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium font-mono">
                              {activeTx.maskedCardNumber || "-"}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 px-4">
                            <span className="text-[13px] text-gray-500 font-medium">Card Type</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium">
                              {activeTx.cardType || "-"}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Invoice Information */}
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-800 mb-3">Invoice Information</h3>
                        <div className="bg-[#F8F9FA] border border-gray-200 rounded-md shadow-sm">
                          
                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Invoice Number</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium font-mono">
                              <Copy className="w-4 h-4 mr-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                              {activeTx.invoiceNumber || "-"}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 px-4">
                            <span className="text-[13px] text-gray-500 font-medium">Invoice PDF</span>
                            <div className="flex items-center text-[13px] text-[#00607A] hover:text-[#004d61] font-medium transition-colors">
                              <Eye className="w-4 h-4 mr-2" />
                              {activeTx.invoicePdfUrl ? (
                                <a href={activeTx.invoicePdfUrl} target="_blank" rel="noreferrer">View Invoice</a>
                              ) : (
                                <span>No Invoice</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Provider Information */}
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-800 mb-3">Provider Information</h3>
                        <div className="bg-[#F8F9FA] border border-gray-200 rounded-md shadow-sm">
                          
                          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
                            <span className="text-[13px] text-gray-500 font-medium">Provider Transaction ID</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium font-mono">
                              <Copy className="w-4 h-4 mr-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                              {activeTx.providerTnxId || "-"}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between py-3 px-4">
                            <span className="text-[13px] text-gray-500 font-medium">Provider Transaction Number</span>
                            <div className="flex items-center text-[13px] text-gray-700 font-medium font-mono">
                              <Copy className="w-4 h-4 mr-2 text-gray-400 cursor-pointer hover:text-gray-600" />
                              {activeTx.providerTnxNumber || "-"}
                            </div>
                          </div>

                        </div>
                      </div>
                      
                    </div>`;

const targetStart = '{/* Main Detail Grid */}';
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
