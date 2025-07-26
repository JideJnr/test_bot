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
  { id: 'bot_test', name: 'bot_test', status: false },
  { id: 'a_test', name: 'b_test', status: false },
  { id: 'bot_t', name: 'bot_t', status: false }
];

let engineStatus = false;

const findBotById = (id: string) => bots.find(bot => bot.id === id);

export const startEngine = async (req: any, res: any) => {
  if (engineStatus) {
    return res.status(200).json({
      success: false,
      status: 'ENGINE_ALREADY_RUNNING',
      message: 'Engine is already running.',
    });
  }
  engineStatus = true;
  for (const bot of bots) {
    const controller = botControllerMap[bot.name];
    if (controller?.start) {
      await controller.start();
      bot.status = true;
    }
  }
  return res.status(200).json({
    success: true,
    status: 'ENGINE_STARTED',
    message: 'Engine has started and all bots are running.',
    bots,
  });
};

export const stopEngine = async (req: any, res: any) => {
  if (!engineStatus) {
    return res.status(200).json({
      success: false,
      error: 'ENGINE_NOT_RUNNING',
      message: 'Engine is not running.',
    });
  }
  for (const bot of bots) {
    const controller = botControllerMap[bot.name];
    if (controller?.stop) {
      await controller.stop();
      bot.status = false;
    }
  }
  engineStatus = false;
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
    status: engineStatus ? 'ENGINE_RUNNING' : 'ENGINE_STOPPED',
    message: engineStatus ? 'Engine is running.' : 'Engine is stopped.',
    bots
  });
};

export const getAllBot = async (req: any, res: any) => {
  if (!engineStatus) {
    return res.status(400).json({
      success: false,
      status: 'ENGINE_NOT_RUNNING',
      message: 'Engine must be running to get bot list.',
    });
  }
  return res.status(200).json({
    success: true,
    message: `Bot list fetched successfully.`,
    data: bots,
  });
};

export const startBotById = async (req: any, res: any) => {
  const { id } = req.body;
  if (!engineStatus) {
    return res.status(400).json({
      success: false,
      status: 'ENGINE_NOT_RUNNING',
      message: 'Engine must be running to start a bot.',
    });
  }
  const bot = findBotById(id);
  if (!bot) {
    return res.status(404).json({ success: false, message: 'Bot not found.' });
  }
  if (bot.status) {
    return res.status(200).json({ success: false, message: 'Bot is already running.' });
  }
  const controller = botControllerMap[bot.name];
  if (controller?.start) {
    await controller.start();
    bot.status = true;
  }
  return res.status(200).json({
    success: true,
    message: `Bot ${bot.name} has been started.`,
    data: bot,
  });
};

export const stopBotById = async (req: any, res: any) => {
  const { id } = req.body;
  if (!engineStatus) {
    return res.status(400).json({
      success: false,
      error: 'ENGINE_NOT_RUNNING',
      message: 'Engine must be running to stop a bot.',
    });
  }
  const bot = findBotById(id);
  if (!bot) {
    return res.status(404).json({ success: false, message: 'Bot not found.' });
  }
  if (!bot.status) {
    return res.status(200).json({ success: false, message: 'Bot is already stopped.' });
  }
  const controller = botControllerMap[bot.name];
  if (controller?.stop) {
    await controller.stop();
    bot.status = false;
  }
  return res.status(200).json({
    success: true,
    message: `Bot ${bot.name} has been stopped.`,
    data: bot,
  });
};

export const getBotById = async (req: any, res: any) => {
  const { id } = req.body;
  const bot = findBotById(id);
  if (!bot) {
    return res.status(404).json({ success: false, message: 'Bot not found.' });
  }
  const controller = botControllerMap[bot.name];
  if (controller?.status) {
    bot.status = controller.status();
  }
  return res.status(200).json({
    success: true,
    message: `Bot ${bot.name} is ${bot.status ? 'running' : 'not running'}.`,
    data: bot,
  });
};