const fs = require('fs');
const file = 'app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state
const stateStart = 'const [volumeViewMode, setVolumeViewMode] = useState("Volume");';
if (content.includes(stateStart) && !content.includes('channelData')) {
  content = content.replace(stateStart, stateStart + '\n  const [channelData, setChannelData] = useState<any[]>([]);\n  const [channelViewMode, setChannelViewMode] = useState("Volume");');
}

// 2. Add calculation in useEffect
const txsLoopStart = 'const cardStats: Record<string, any> = {';
const txsLoopAdd = `    const chStats: Record<string, any> = {
      "Terminal": { name: "Terminal", approved: 0, declined: 0, purchases: 0, refunds: 0 },
      "E-Commerce": { name: "E-Commerce", approved: 0, declined: 0, purchases: 0, refunds: 0 }
    };
`;
if (content.includes(txsLoopStart) && !content.includes('chStats')) {
  content = content.replace(txsLoopStart, txsLoopAdd + '\n    ' + txsLoopStart);
}

const insideLoopRegex = /(if \(isRefund\) cardStats\[normalizedCt\]\.refunds \+= amt;\s*else cardStats\[normalizedCt\]\.purchases \+= amt;)/;
const insideLoopAdd = `      const channel = tx.transactionType === "CaptureWithToken" ? "E-Commerce" : "Terminal";
      if (isApproved) chStats[channel].approved++;
      else chStats[channel].declined++;
      if (isRefund) chStats[channel].refunds += amt;
      else chStats[channel].purchases += amt;
`;
if (content.match(insideLoopRegex) && !content.includes('chStats[channel]')) {
  content = content.replace(insideLoopRegex, '$1\n' + insideLoopAdd);
}

const afterLoopRegex = /(setVolumeData\(sortedStats\.map\(\(c: any\) => \{\s*return \{ \.\.\.c, total: c\.purchases \+ c\.refunds \};\s*\}\)\);)/;
const afterLoopAdd = `
    const sortedChannels = Object.values(chStats)
      .filter((c: any) => (c.purchases + c.refunds) > 0 || (c.approved + c.declined) > 0)
      .sort((a: any, b: any) => (b.purchases + b.refunds) - (a.purchases + a.refunds));

    setChannelData(sortedChannels.map((c: any) => {
       return { ...c, total: c.purchases + c.refunds };
    }));
`;
if (content.match(afterLoopRegex) && !content.includes('setChannelData')) {
  content = content.replace(afterLoopRegex, '$1\n' + afterLoopAdd);
}

// 3. Add UI block at the end of the file
const insertUIPoint = '            </div>\n\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n}';

const uiBlock = `            {/* Channel */}
            <div className="bg-white border border-gray-200 rounded-[8px] p-6 shadow-sm relative overflow-hidden mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[16px] font-bold">Channel</h2>
                <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
                  <button 
                    onClick={() => setChannelViewMode("Volume")}
                    className={\`\${channelViewMode === "Volume" ? "bg-[#102B4E] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"} px-4 py-1.5 text-[11px] font-medium rounded-full transition-all\`}
                  >
                    Volume
                  </button>
                  <button 
                    onClick={() => setChannelViewMode("Distribution")}
                    className={\`\${channelViewMode === "Distribution" ? "bg-[#102B4E] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"} px-4 py-1.5 text-[11px] font-medium rounded-full transition-all\`}
                  >
                    % Distribution
                  </button>
                </div>
              </div>

              {channelViewMode === "Volume" ? (
                <>
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#00B4D8]"></div>
                      <span className="text-[11px] text-gray-500">Purchases</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#F56565]"></div>
                      <span className="text-[11px] text-gray-500">Refunds</span>
                    </div>
                    <div className="text-[12px] font-bold ml-2">Total \${summary.totalAmount.toFixed(2)}</div>
                  </div>

                  <div className="h-[320px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={channelData}
                        margin={{ top: 0, right: 80, left: 30, bottom: 0 }}
                        barSize={16}
                      >
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4A5568', fontSize: 10, fontWeight: 500 }} dx={-10} />
                        <Tooltip cursor={{fill: 'transparent'}} formatter={(val: any) => '$' + Number(val).toFixed(2)} />
                        <Bar dataKey="purchases" stackId="a" fill="#00B4D8" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="refunds" stackId="a" fill="#F56565" radius={[0, 4, 4, 0]}>
                           <LabelList dataKey="total" content={renderVolumeLabel} position="right" />
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
                        <Tooltip formatter={(value: any) => ['$' + Number(value).toFixed(2), "Volume"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="w-full max-w-[320px]">
                    <table className="w-full text-left text-[12.5px]">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-3 font-bold text-gray-700"></th>
                          <th className="pb-3 font-bold text-gray-700 w-20 text-right">Volume</th>
                          <th className="pb-3 font-bold text-gray-700 w-24 text-right">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {channelData.map((entry, index) => {
                          let color = "#00607A";
                          let label = entry.name;
                          if (entry.name === "Terminal") { color = "#00B4D8"; }
                          else if (entry.name === "E-Commerce") { color = "#8B5CF6"; }

                          const totalVol = channelData.reduce((acc, curr) => acc + curr.total, 0);
                          const percentage = totalVol > 0 
                            ? ((entry.total / totalVol) * 100).toFixed(1) + "%" 
                            : "0.0%";

                          return (
                            <tr key={index} className="border-b border-gray-50 last:border-0">
                              <td className="py-2.5 flex items-center gap-3">
                                <div className="w-3 h-3" style={{ backgroundColor: color }}></div>
                                <span className="text-gray-600 font-medium">{label}</span>
                              </td>
                              <td className="py-2.5 text-gray-600 text-right">\${Number(entry.total).toFixed(2)}</td>
                              <td className="py-2.5 text-gray-600 text-right">{percentage}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-200">
                          <td className="py-3 font-bold text-gray-900">Total</td>
                          <td className="py-3 font-bold text-gray-900 text-right">\${channelData.reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}</td>
                          <td className="py-3 font-bold text-gray-900 text-right">100.0%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
`;

if (content.includes(insertUIPoint) && !content.includes('{/* Channel */}')) {
  content = content.replace(insertUIPoint, uiBlock);
}

fs.writeFileSync(file, content);
console.log('Success');
