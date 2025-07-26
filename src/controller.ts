import { getTestStatus, startTestBot, stopTestBot } from './bots/test';

interface Bot {
  id: string;
  name: keyof typeof botControllerMap;
  status: boolean;
}

interface BotController {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  status: () => boolean;
}

const botControllerMap: Record<string, BotController> = {
  bot_test: {
    start: startTestBot,
    stop: async () => stopTestBot(), 
    status: getTestStatus,
  },
};

const bots: Bot[] = [
  { id: 'bot_test', name: 'bot_test', status: false }
];

let engineStatus = false;

const findBotById = (id: string) => bots.find(bot => bot.id === id);

export const startEngine = async (req: any, res: any) => {
  return res.status(200).json({
    success: true,
    status: 'ENGINE_STARTED',
    message: 'Engine has started and all bots are running.'
  });
};

export const stopEngine = async (req: any, res: any) => {
  return res.status(200).json({
    success: true,
    status: 'ENGINE_STOPPED',
    message: 'Engine has stopped and all bots are shut down.',
    bots,
  });
};

export const getEngineStatus = async (req: any, res: any) => {
  return res.status(200).json({
    success: true,
    status: 'ENGINE_RUNNING ENGINE_STOPPED',
    message:  'Engine is running.Engine is stopped.',
  });
};

export const getAllBot = async (req: any, res: any) => {
  return res.status(200).json({
    success: true,
    message: `Bot list fetched successfully.`,
    data: bots,
  });
};

export const startBotById = async (req: any, res: any) => {

  return res.status(200).json({
    success: true,
    message: `Bot  has been started.`,
    data: 'bot_test',
  });
};

export const stopBotById = async (req: any, res: any) => {
  const { id } = req.params;
 
  return res.status(200).json({
    success: true,
    message: `Bot ${id} has been stopped.`,
    data: id,
  });
};

export const getBotById = async (req: any, res: any) => {
  const { id } = req.params;
  return res.status(200).json({
    success: true,
    message: `Bot ${id} is ${id ? 'running' : 'not running'}.`,
    data: id,
  });
};