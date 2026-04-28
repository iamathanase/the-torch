import { AICategoryContext } from '@/data/types';

const aiResponses: Record<AICategoryContext, Record<string, string[]>> = {
  farming: {
    tomatoes: [
      'Great choice! Tomatoes need 6-8 hours of sunlight daily. Water consistently and keep soil moist but not waterlogged. Prune suckers for better fruit production.',
      'For tomato farming, I recommend: Plant in well-draining soil, fertilize every 2 weeks, and provide stakes for support. Watch for common pests like hornworms.',
      'Tomatoes thrive in warm weather (70-85°F). Consider companion planting with basil and marigolds to deter pests naturally!',
    ],
    seeds: [
      'Seeds are a great investment! Choose seeds suited to your climate. Start them indoors 6-8 weeks before the last frost date for best results.',
      'Tips for seed success: Keep soil consistently moist, provide good lighting, and maintain warm temperatures. Thin seedlings once they develop true leaves.',
      'Remember to harden off seedlings by gradually exposing them to outdoor conditions before transplanting!',
    ],
    soil: [
      'Healthy soil is the foundation! Test your soil for pH and nutrients. Add organic compost to improve structure and water retention.',
      'I recommend adding mulch (2-3 inches) around plants to regulate soil temperature and reduce weeding. Rotate crops yearly to maintain soil health.',
      'For best results, incorporate 2-3 inches of compost before planting. This improves both water retention and drainage!',
    ],
    weather: [
      'Weather plays a big role in farming success! Monitor frost dates and plan your planting schedule accordingly.',
      'Protect young plants from unexpected frosts with row covers. Water heavily before frost to insulate the soil.',
      'Consider microclimate conditions in your area - north-facing slopes stay cooler longer than south-facing areas.',
    ],
    default: [
      'That sounds interesting! I\'d recommend consulting with experienced farmers in your area for region-specific advice.',
      'Great question! Different crops have different requirements. What specific crop are you interested in learning about?',
      'I\'m here to help! Ask me about soil health, irrigation, pest management, crop rotation, or specific plants.',
    ],
  },
  orders: {
    tracking: [
      'To track your order, check the Orders page in your dashboard. You\'ll see the current status and estimated delivery date.',
      'Your order status shows: Pending → Confirmed → Shipped → Delivered. Each stage is updated in real-time!',
      'Most orders ship within 2-3 business days. You\'ll receive a notification when your order is on its way!',
    ],
    returns: [
      'We offer returns within 14 days of delivery if items are unused and in original condition. Contact support for a return label.',
      'To request a return, go to your Orders page and click "Return" on the item. Our team will process it quickly.',
      'Refunds are processed within 5-7 business days after we receive your return.',
    ],
    payment: [
      'We accept all major payment methods for secure transactions. All payments are processed securely.',
      'Having payment issues? Check your card details or try a different payment method. Contact support if problems persist.',
      'Your payment information is encrypted and secure. We never store full card details.',
    ],
    default: [
      'Need help with your order? I can assist with tracking, returns, or payments. What do you need?',
      'Orders are processed quickly and securely. Ask me anything about your purchase!',
      'I\'m here to help make your shopping experience smooth!',
    ],
  },
  products: {
    recommendations: [
      'Based on your interests, I\'d recommend checking out our seeds and organic fertilizers collection!',
      'For beginners, start with hardy crops like tomatoes, peppers, and leafy greens. We have starter kits available!',
      'Premium organic products are a great investment for long-term soil health and crop quality.',
    ],
    pricing: [
      'Our prices are competitive and reflect high-quality products. Check if you qualify for bulk discounts!',
      'Farmers with large orders can request wholesale pricing. Contact our sales team for details.',
      'Prices vary by season and availability. Subscribe to get notifications of sales and discounts!',
    ],
    availability: [
      'Most items ship within 2-3 business days. Some premium items may have a longer lead time.',
      'Stock is updated daily. If an item is out of stock, you can request a notification when it\'s back.',
      'Seasonal items have limited availability. Order early during peak seasons to avoid stockouts!',
    ],
    default: [
      'We have a wide selection of farming products! What are you looking for?',
      'Browse our catalog for seeds, tools, fertilizers, and more. Feel free to ask for recommendations!',
      'I can help you find the perfect product for your needs!',
    ],
  },
  learning: {
    courses: [
      'Our learning hub has courses on organic farming, soil management, crop rotation, and more!',
      'Start with "Organic Farming Basics" - it\'s perfect for beginners and covers all fundamentals.',
      'Advanced courses are available for farmers looking to specialize in specific crops or techniques.',
    ],
    certification: [
      'Completing courses earns you certificates that can boost your credibility with customers!',
      'Track your progress in the Learning section and share certificates with your network.',
      'Certified farmers often get better market prices for their produce. Invest in your skills!',
    ],
    resources: [
      'We provide free resources including guides, videos, and interactive tools for learning.',
      'Join our community forum to share experiences and learn from other farmers!',
      'Weekly webinars cover trending topics in modern agriculture. Check the schedule!',
    ],
    default: [
      'Our Learning Hub has everything you need to improve your skills!',
      'Start with beginner courses and progress to advanced topics. What interests you?',
      'Knowledge is power! What would you like to learn about today?',
    ],
  },
  general: {
    greeting: [
      'Hello! I\'m the FarmDialogue Assistant. How can I help you today? 🌾',
      'Welcome! I\'m here to help with farming tips, products, orders, and more!',
      'Hi there! What can I assist you with today?',
    ],
    help: [
      'I can help with: Farming advice, product recommendations, order tracking, learning resources, and general questions.',
      'Ask me about farming techniques, our products, your orders, or learning opportunities!',
      'I\'m here to make your FarmDialogue experience better. What do you need?',
    ],
    thanks: [
      'Happy to help! Feel free to ask me anything else you\'d like to know. 😊',
      'You\'re welcome! I\'m always here if you need more assistance.',
      'Glad I could help! Don\'t hesitate to reach out with more questions.',
    ],
    default: [
      'That\'s an interesting point! Let me know if there\'s anything specific I can help you with.',
      'I appreciate your input. Is there something I can assist you with?',
      'Feel free to ask me any questions about farming, products, or your account!',
    ],
  },
};

export function generateAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Detect context from keywords
  let context: AICategoryContext = 'general';

  if (lowerMessage.includes('tomato') || lowerMessage.includes('pepper') || lowerMessage.includes('grow')) {
    context = 'farming';
  } else if (
    lowerMessage.includes('order') ||
    lowerMessage.includes('track') ||
    lowerMessage.includes('delivery') ||
    lowerMessage.includes('payment')
  ) {
    context = 'orders';
  } else if (lowerMessage.includes('product') || lowerMessage.includes('price') || lowerMessage.includes('available')) {
    context = 'products';
  } else if (
    lowerMessage.includes('course') ||
    lowerMessage.includes('learn') ||
    lowerMessage.includes('certificate') ||
    lowerMessage.includes('training')
  ) {
    context = 'learning';
  }

  // Detect subcategory within context
  let subcategory = 'default';

  if (context === 'farming') {
    if (lowerMessage.includes('tomato')) subcategory = 'tomatoes';
    else if (lowerMessage.includes('seed')) subcategory = 'seeds';
    else if (lowerMessage.includes('soil')) subcategory = 'soil';
    else if (lowerMessage.includes('weather') || lowerMessage.includes('frost')) subcategory = 'weather';
  } else if (context === 'orders') {
    if (lowerMessage.includes('track') || lowerMessage.includes('where')) subcategory = 'tracking';
    else if (lowerMessage.includes('return') || lowerMessage.includes('refund')) subcategory = 'returns';
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) subcategory = 'payment';
  } else if (context === 'products') {
    if (lowerMessage.includes('recommend')) subcategory = 'recommendations';
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) subcategory = 'pricing';
    else if (lowerMessage.includes('available') || lowerMessage.includes('stock')) subcategory = 'availability';
  } else if (context === 'learning') {
    if (lowerMessage.includes('course')) subcategory = 'courses';
    else if (lowerMessage.includes('certificate')) subcategory = 'certification';
    else if (lowerMessage.includes('resource') || lowerMessage.includes('guide')) subcategory = 'resources';
  } else if (context === 'general') {
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) subcategory = 'greeting';
    else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) subcategory = 'help';
    else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) subcategory = 'thanks';
  }

  // Get response pool and select random response
  const responsePool = aiResponses[context]?.[subcategory] || aiResponses[context]?.['default'] || aiResponses['general']['default'];

  return responsePool[Math.floor(Math.random() * responsePool.length)];
}

export function getAITypingDelay(): number {
  // Random delay between 500-2000ms to simulate realistic typing
  return 500 + Math.random() * 1500;
}
