import Position from '@models/Position';
import Calendar from '@models/Calendar';
import User from '@models/User';
import mongoose from 'mongoose';
import moment from 'moment';

const totalSlot = (position: any, dbCalendar: any) => {
    let st: any = {};
    position.map((ps: any) => {
        let fst = false;
        dbCalendar.map((item: any, index: any) => {
            if (item.position.includes(ps)) {
                if (fst) {
                    st[ps] = { total: st[ps]?.total + 1, slot: [...st[ps]?.slot, item] };
                } else {
                    st[ps] = { total: 1, slot: [item] };
                }
                fst = true;
            }
        });
    });
    return st;
};

const empPosition = (position: any, dbemployee: any) => {
    let emp: any = {};
    position.map((ps: any) => {
        let fst = false;
        dbemployee.map((item: any, index: any) => {
            if (String(item.position) == String(ps)) {
                if (fst) {
                    emp[ps] = { total: emp[ps]?.total + 1 };
                } else {
                    emp[ps] = { total: 1 };
                }
                fst = true;
            }
        });
    });
    return emp;
};

const psEmployee = (position: any, dbemployee: any) => {
    let psEm: any = {};
    position.map((ps: any) => {
        let fst = false;
        dbemployee.map((item: any, index: any) => {
            if (String(item.position) == String(ps)) {
                if (fst) {
                    if (!psEm[ps].includes(item._id)) {
                        psEm[ps].push(item._id);
                    }
                } else {
                    psEm[ps] = [item._id];
                }
                fst = true;
            }
        });
    });

    return psEm;
};

const arraySearch = (arrArg: any, key: any, value: any) => {
    let json: any = {};
    arrArg.map((item: any) => {
        if (item[key] === value) {
            json = item;
        }
    });

    return json;
};

let assignSlot: any = [];
let employeeInsert: any = {};

const AlgRepeat = (ps: any, psEmp: any, tlSlt: any, dbemployee: any) => {

    psEmp[ps] &&
        psEmp[ps].map((iEmp: any) => {
            let assignEmpSlot = employeeInsert[ps]?.[iEmp] ? employeeInsert[ps]?.[iEmp] : [];
            let ix = 0;
            tlSlt[ps].slot.map((item: any, index: any) => {
                // console.log(!assignSlot.includes(item._id),assignSlot,item._id)
                if (!assignSlot.includes(item._id)) {
                    // console.log('avg',Math.round(tlSlt[ps].avg))
                    if (Math.round(tlSlt[ps].avg) >= ix + 1) {
                        //constrain
                        // console.log(arraySearch(dbemployee, '_id', iEmp))
                      //  console.log(arraySearch(dbemployee, '_id', iEmp).firstName,arraySearch(dbemployee, '_id', iEmp).constraints[0] ,item.shift,item._id)
                        if (arraySearch(dbemployee, '_id', iEmp).constraints[0] !== item.shift) {
                            let unAvailability = arraySearch(dbemployee, '_id', iEmp)?.unAvailability.map((it:any) => moment(it).format("MM-DD-YYYY"))
                            console.log(unAvailability,moment(item.Date).format("MM-DD-YYYY"))
                            if(!unAvailability.includes(moment(new Date(item.Date)).format("MM-DD-YYYY"))){
                                assignSlot.push(item._id);
                                assignEmpSlot.push(item._id);
                                employeeInsert[ps] = {
                                  ...employeeInsert[ps],
                                  [iEmp]: assignEmpSlot
                                };
                                ix++;
                            }
                            // if(unAvailability.includes())
                            
                        }
                    }
                }
            });
        });
};

export const AutoShiftAlg = async () => {
    let dbPs = await Position.find({});
    let dbSf = await Calendar.find({});
    let Us = await User.find({ role: 'employee' });
    let position = dbPs.map((item) => String(item._id));

    let tlSlt = totalSlot(position, dbSf);
    let tlEmp = empPosition(position, Us);
    let psEmp = psEmployee(position, Us);

    //avg
    for (let Ekey in tlEmp) {


        let notOfEmp = tlEmp[Ekey].total;
        let avg = tlSlt[Ekey].total / notOfEmp;
        tlSlt[Ekey].avg = avg;
    }
    // let tlEmp = empPosition();
    // let psEmp = psEmployee();
   

    position.map((ps: any) => {
        AlgRepeat(String(ps), psEmp, tlSlt, Us);
        let rp = true;
        while (rp) {
            let tl = 4;

            let op = ['1', '2', '3', '5'];
            op.map((item) => {
                if (item !== '5') {
                    
                    AlgRepeat(String(ps), psEmp, tlSlt, Us);
                } else {
                    rp = false;
                }
            });
        }
    });

    // console.log({ employeeInsert });
    //db store
  for (let psKey in employeeInsert) {
        for (let epKey in employeeInsert[psKey]) {
            employeeInsert[psKey][epKey]?.map(async (item: any) => {
                let Cld = await Calendar.findOne({ _id: item, employee: String(epKey) });
                if (Cld == null) {
                    await Calendar.findOneAndUpdate({ _id: item }, { $addToSet: { employee: epKey } });
                }
            });
        }
    }

    //console.log(position[0] == '6385ab0f6aa5978366feefce');
};
