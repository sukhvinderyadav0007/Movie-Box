class DynamicPricingModel:
    """Dynamic Pricing based on Demand"""

    def __init__(self):
        self.base_price = 150
        self.min_price = 100
        self.max_price = 300

    def calculate_price(self, demand_percentage, base_price=None):
        """
        Calculate dynamic price based on demand
        Args:
            demand_percentage: Predicted demand (0-100)
            base_price: Base ticket price (default: self.base_price)
        Returns:
            Dynamic price
        """
        if base_price is None:
            base_price = self.base_price

        # Price tiers based on demand
        if demand_percentage > 80:
            # Very high demand: +30%
            multiplier = 1.3
        elif demand_percentage > 60:
            # High demand: +15%
            multiplier = 1.15
        elif demand_percentage > 40:
            # Medium demand: no change
            multiplier = 1.0
        elif demand_percentage > 20:
            # Low demand: -10%
            multiplier = 0.9
        else:
            # Very low demand: -20%
            multiplier = 0.8

        dynamic_price = base_price * multiplier
        # Clamp between min and max
        dynamic_price = max(self.min_price, min(self.max_price, dynamic_price))
        return round(dynamic_price, 2)

    def get_pricing_insights(self, demand_percentage, base_price=None):
        """Get detailed pricing insights"""
        if base_price is None:
            base_price = self.base_price

        dynamic_price = self.calculate_price(demand_percentage, base_price)
        price_change = dynamic_price - base_price
        percent_change = (price_change / base_price) * 100

        return {
            'base_price': base_price,
            'dynamic_price': dynamic_price,
            'price_change': price_change,
            'percent_change': round(percent_change, 2),
            'demand_level': self._get_demand_level(demand_percentage),
        }

    def _get_demand_level(self, demand_percentage):
        """Get human-readable demand level"""
        if demand_percentage > 80:
            return 'Very High'
        elif demand_percentage > 60:
            return 'High'
        elif demand_percentage > 40:
            return 'Medium'
        elif demand_percentage > 20:
            return 'Low'
        else:
            return 'Very Low'
