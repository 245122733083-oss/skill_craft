/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  CheckSquare, 
  Gamepad2, 
  Timer, 
  ArrowLeft,
  Github,
  ExternalLink,
  Code2,
  Cpu,
  Globe,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';

// --- SUB-COMPONENTS ---

// 1. CALCULATOR
const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  
  const handleInput = (val: string) => {
    if (display === '0' && !isNaN(Number(val))) {
      setDisplay(val);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const clear = () => setDisplay('0');
  const del = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  
  const calculate = () => {
    try {
      const sanitized = display.replace(/x/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      setDisplay(String(Number(result).toFixed(2).replace(/\.00$/, '')));
    } catch {
      setDisplay('Error');
      setTimeout(() => setDisplay('0'), 1500);
    }
  };

  const buttons = [
    'C', 'DEL', '÷', 'x',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.'
  ];

  return (
    <div className="flex flex-col items-center py-4">
      <div className="bg-white p-5 rounded-2xl w-full max-w-xs border border-slate-100 flex flex-col h-[420px]">
        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 px-1">Scientific Calc</h2>
        <div className="bg-slate-50 p-6 rounded-xl mb-4 text-right shadow-inner border border-slate-100">
          <div className="text-2xl font-medium text-slate-800 font-mono tracking-tighter truncate leading-tight">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2 flex-grow">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => {
                if (btn === 'C') clear();
                else if (btn === 'DEL') del();
                else if (btn === '=') calculate();
                else handleInput(btn);
              }}
              className={`flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 text-sm ${
                btn === '=' ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600' : 
                ['C', 'DEL', '÷', 'x', '-', '+'].includes(btn) ? 'bg-slate-50 text-blue-500 hover:bg-slate-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } ${btn === '0' ? 'col-span-2' : ''}`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 2. TO-DO LIST
const TodoApp = () => {
  const [tasks, setTasks] = useState<{id: number, text: string, completed: boolean}[]>([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 flex flex-col h-[420px] overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4">Task Queue</h2>
          <div className="relative flex gap-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add new task..."
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-700"
            />
            <button 
              onClick={addTask}
              className="bg-blue-500 text-white w-9 h-9 flex items-center justify-center rounded-lg hover:bg-blue-600 transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        <div className="flex-grow p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
          <AnimatePresence initial={false}>
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <CheckSquare size={40} className="mb-2 opacity-20" />
                <p className="text-xs font-medium uppercase tracking-widest">No active tasks</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg group hover:border-blue-100 transition-all"
                  >
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        task.completed ? 'bg-blue-500 border-blue-500' : 'border-slate-200 bg-white'
                      }`}
                    >
                      {task.completed && <div className="w-2 h-2 bg-white rounded-[1px]" />}
                    </button>
                    <span className={`flex-1 text-sm font-medium transition-all ${task.completed ? 'opacity-40 line-through' : 'text-slate-600'}`}>
                      {task.text}
                    </span>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// 3. TIC TAC TOE
const TicTacToeApp = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return squares.every(s => s !== null) ? { winner: 'Draw', line: null } : null;
  };

  const winInfo = calculateWinner(board);
  const winner = winInfo?.winner;
  
  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center py-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col h-[420px] w-full max-w-xs items-center justify-center">
        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-8 w-full text-left">Tactical Engine</h2>
        
        <div className="mb-6 text-sm font-semibold tracking-tight">
          {winner ? (
            <span className={winner === 'Draw' ? 'text-slate-500' : 'text-blue-600'}>
              {winner === 'Draw' ? "Draw Session" : `Player ${winner} Victory`}
            </span>
          ) : (
            <span>Turn: <span className="text-blue-600">{isXNext ? 'X' : 'O'}</span></span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!winner || !!board[i]}
              className={`w-16 h-16 rounded-lg text-xl font-bold flex items-center justify-center transition-all bg-slate-50 border border-slate-100
                ${!board[i] && !winner ? 'hover:bg-slate-100 active:scale-95' : ''}
                ${winInfo?.line?.includes(i) ? 'bg-blue-50 border-blue-200' : ''}
              `}
            >
              <span className={`transition-all duration-300 ${cell ? 'scale-100' : 'scale-0'} 
                ${cell === 'X' ? 'text-blue-600' : 'text-rose-500'}`}
              >
                {cell}
              </span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={reset}
          className="mt-10 flex items-center gap-2 text-[10px] text-slate-400 hover:text-slate-600 uppercase font-black tracking-[0.2em] transition-all"
        >
          <RotateCcw size={12} />
          {winner ? 'Reset Session' : 'Restart'}
        </button>
      </div>
    </div>
  );
};

// 4. STOPWATCH
const StopwatchApp = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<{id: number, time: string}[]>([]);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (running) {
      id = setInterval(() => {
        setTime(prev => prev + 1);
      }, 10); // Faster increment for "minimalist tech" feel (ms-like)
    }
    return () => clearInterval(id);
  }, [running]);

  const formatTime = (totalCentiSeconds: number) => {
    const minutes = Math.floor(totalCentiSeconds / 6000);
    const seconds = Math.floor((totalCentiSeconds % 6000) / 100);
    const centis = totalCentiSeconds % 100;
    return {
      main: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      sub: `${String(centis).padStart(2, '0')}`
    };
  };

  const stop = () => {
    if (running) {
      setRunning(false);
      const { main, sub } = formatTime(time);
      setLogs([{ id: Date.now(), time: `${main}.${sub}` }, ...logs].slice(0, 4));
    }
  };

  const reset = () => {
    setRunning(false);
    setTime(0);
    setLogs([]);
  };

  const current = formatTime(time);

  return (
    <div className="flex flex-col items-center py-4">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col h-[420px] w-full max-w-sm items-center justify-center">
        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-8 w-full text-left">Chrono Pulse</h2>
        
        <div className="flex-grow flex flex-col items-center justify-center w-full">
          <div className="text-6xl font-light tracking-tighter text-slate-800 font-mono mb-12 flex items-baseline">
            {current.main}
            <span className="text-2xl text-slate-300 ml-1">.{current.sub}</span>
          </div>
          
          <div className="flex gap-4 mb-4">
            <button 
              onClick={reset}
              className="w-28 py-2.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              Reset
            </button>
            {!running ? (
              <button 
                onClick={() => setRunning(true)}
                className="w-28 py-2.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-800 transition-all uppercase tracking-widest"
              >
                Start
              </button>
            ) : (
              <button 
                onClick={stop}
                className="w-28 py-2.5 bg-blue-500 text-white rounded-full text-xs font-semibold hover:bg-blue-600 transition-all uppercase tracking-widest"
              >
                Pause
              </button>
            )}
          </div>

          <div className="mt-8 w-full border-t border-slate-50 pt-6 space-y-3">
            {logs.map((log, i) => (
              <div key={log.id} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
                <span>Record {String(logs.length - i).padStart(2, '0')}</span>
                <span className="font-mono text-slate-500 text-sm">{log.time}</span>
              </div>
            ))}
            {logs.length === 0 && <div className="text-center text-[10px] text-slate-200 font-bold uppercase py-2 tracking-[0.3em]">No Log Data</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- LANDING PAGE ---

export default function App() {
  const [activeTask, setActiveTask] = useState<string | null>(null);

  const tasks = [
    { id: 'calci', name: 'Calculator', icon: <Calculator size={20} />, comp: <CalculatorApp />, desc: 'Arithmetic precision' },
    { id: 'todo', name: 'Task Board', icon: <CheckSquare size={20} />, comp: <TodoApp />, desc: 'Productivity flow' },
    { id: 'ttt', name: 'Tic-Tac-Toe', icon: <Gamepad2 size={20} />, comp: <TicTacToeApp />, desc: 'Strategic logic' },
    { id: 'stop', name: 'Stopwatch', icon: <Timer size={20} />, comp: <StopwatchApp />, desc: 'Temporal accuracy' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8 md:p-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div onClick={() => setActiveTask(null)} className="cursor-pointer">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">Utility Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Core Application Prototypes: Internship Portfolio</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            <a href="#" className="hover:text-slate-900 transition-colors flex items-center gap-2">
              <Github size={14} /> Github
            </a>
            <span className="opacity-30">/</span>
            <span className="text-blue-500">Pradeep Thudum</span>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {!activeTask ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {tasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setActiveTask(task.id)}
                    className="app-card cursor-pointer group flex flex-col justify-between h-[320px]"
                  >
                    <div>
                      <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform origin-left">
                        {task.icon}
                      </div>
                      <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">{task.name}</h3>
                      <p className="text-sm text-slate-600 font-medium mb-4">{task.desc}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase">Interactive</span>
                      <ExternalLink size={14} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="mb-6">
                  <button 
                    onClick={() => setActiveTask(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all"
                  >
                    <ArrowLeft size={14} /> Close Activity
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-2 shadow-xl shadow-slate-200/50">
                  <div className="app-card border-none shadow-none min-h-[500px] flex items-center justify-center bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="w-full">
                      {tasks.find(t => t.id === activeTask)?.comp}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          <div>Skill Craft Technologies &copy; 2025</div>
          <div className="flex gap-8">
            <span className="hover:text-blue-500 cursor-alias">Documentation</span>
            <span className="hover:text-blue-500 cursor-alias">Source</span>
            <span className="hover:text-blue-500 cursor-alias">Audit</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
