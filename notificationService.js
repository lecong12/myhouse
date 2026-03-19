import { formatCurrency } from '@/lib/utils';

export async function sendTransactionNotification(transaction) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram credentials missing. Skipping notification.");
    return;
  }

  // Format message content
  let message = `🔔 *GIAO DỊCH MỚI* 🔔\n`;
  message += `-----------------------------\n`;
  
  const typeEmoji = transaction.type === 'INCOME' ? '➕ THU' : '➖ CHI';
  message += `💰 *Loại:* ${typeEmoji}\n`;
  message += `💵 *Số tiền:* \`${formatCurrency(transaction.amount)}\`\n`;
  message += `📝 *Nội dung:* ${transaction.title}\n`;
  message += `🏗️ *Giai đoạn:* ${transaction.phase}\n`;
  
  if (transaction.contractor) message += `👷 *Nhà thầu:* ${transaction.contractor}\n`;
  
  const statusMap = { 'PAID': '✅ Đã TT', 'PENDING': '⏳ Treo', 'CANCELLED': '❌ Hủy' };
  message += `📊 *Trạng thái:* ${statusMap[transaction.status] || 'N/A'}\n`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    // Send receipt photo if exists
    if (transaction.receiptUrl && response.ok) {
        // Logic for sendPhoto can be added here
    }

  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}