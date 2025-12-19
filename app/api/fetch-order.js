let orders = []; // Mock database

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { orderId } = req.query;

        // Example logic (replace with real order fetching logic)
        if (orderId) {
            const order = orders.find(order => order.orderId === parseInt(orderId));
            if (order) {
                res.status(200).json({ message: 'Order fetched successfully!', order });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        } else {
            res.status(400).json({ message: 'Order ID is required' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
