const fs = require('fs');
const file = 'app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStart = '            {/* Channel */}';
const targetEnd = '            </div>\n\n          </div>\n        </div>';

const replacement = `            {/* Channel */}
            <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm relative overflow-hidden mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[16px] font-bold">Channel</h2>
                <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
                  <button 
                    onClick={() => setChannelViewMode("Count")}
                    className={\`\${channelViewMode === "Count" ? "bg-[#102B4E] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"} px-4 py-1.5 text-[11px] font-medium rounded-full transition-all\`}
                  >
                    Count
                  </button>
                  <button 
                    onClick={() => setChannelViewMode("Distribution")}
                    className={\`\${channelViewMode === "Distribution" ? "bg-[#102B4E] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"} px-4 py-1.5 text-[11px] font-medium rounded-full transition-all\`}
                  >
                    % Distribution
                  </button>
                </div>
              </div>

              {channelViewMode === "Count" ? (
                <>
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#00607A]"></div>
                      <span className="text-[11px] text-gray-500">Approved</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#F56565]"></div>
                      <span className="text-[11px] text-gray-500">Declined</span>
                    </div>
                    <div className="text-[12px] font-bold ml-2">Total {summary.totalCount}</div>
                    <div className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold px-2 py-0.5 rounded-full ml-[-12px]">Approval rate {totalApprovalRate}</div>
                  </div>

                  <div className="h-[320px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={channelData}
                        margin={{ top: 0, right: 80, left: 30, bottom: 0 }}
                        barSize={16}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#A0AEC0', fontSize: 11 }} />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4A5568', fontSize: 10, fontWeight: 500 }} dx={-10} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="approved" stackId="a" fill="#00607A" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="declined" stackId="a" fill="#F56565" radius={[0, 4, 4, 0]}>
                           <LabelList dataKey="total" content={renderCountLabel} position="right" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 mt-4 h-[320px]">
                  <div className="w-[240px] h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          dataKey="total"
                          stroke="none"
                        >
                          {channelData.map((entry, index) => {
                            let color = "#00607A";
                            if (entry.name === "Terminal") color = "#00B4D8";
                            else if (entry.name === "E-Commerce") color = "#8B5CF6";
                            return <Cell key={\`cell-\${index}\`} fill={color} />;
                          })}
                        </Pie>
                        <Tooltip formatter={(value: any) => [value, "Transactions"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="w-full max-w-[320px]">
                    <table className="w-full text-left text-[12.5px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-3 font-bold text-gray-700"></th>
                          <th className="pb-3 font-bold text-gray-700 w-16 text-right">Count</th>
                          <th className="pb-3 font-bold text-gray-700 w-24 text-right">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channelData.map((entry, index) => {
                          let color = "#00607A";
                          let label = entry.name;
                          if (entry.name === "Terminal") { color = "#00B4D8"; }
                          else if (entry.name === "E-Commerce") { color = "#8B5CF6"; }

                          const totalCount = channelData.reduce((acc, curr) => acc + curr.total, 0);
                          const percentage = totalCount > 0 
                            ? ((entry.total / totalCount) * 100).toFixed(1) + "%" 
                            : "0.0%";

                          return (
                            <tr key={index} className="border-b border-gray-50 last:border-0">
                              <td className="py-2.5 flex items-center gap-3">
                                <div className="w-3 h-3" style={{ backgroundColor: color }}></div>
                                <span className="text-gray-600 font-medium">{label}</span>
                              </td>
                              <td className="py-2.5 text-gray-600 text-right">{entry.total}</td>
                              <td className="py-2.5 text-gray-600 text-right">{percentage}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-200">
                          <td className="py-3 font-bold text-gray-900">Total</td>
                          <td className="py-3 font-bold text-gray-900 text-right">{channelData.reduce((acc, curr) => acc + curr.total, 0)}</td>
                          <td className="py-3 font-bold text-gray-900 text-right">100.0%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
`;

const startIndex = content.indexOf(targetStart);
const endIndex = content.indexOf(targetEnd, startIndex);
if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(file, content);
  console.log("Success");
} else {
  console.log("Not found");
}
