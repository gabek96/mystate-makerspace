/**
 * Mock API service layer.
 * All data flows through here so swapping to real APIs later is trivial.
 */

import weatherData from '../data/weather.json';
import classesData from '../data/classes.json';
import cyrideData from '../data/cyride.json';
import diningData from '../data/dining.json';
import makerspaceData from '../data/makerspace.json';
import profileData from '../data/profile.json';

// Simulate network delay
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// Deep clone to prevent mutation
const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const api = {
  async getWeather() {
    await delay(100);
    return clone(weatherData.current);
  },

  async getClasses() {
    await delay(150);
    return clone(classesData.today);
  },

  async getCyRide() {
    await delay(200);
    return clone(cyrideData.nearby);
  },

  async getDining() {
    await delay(150);
    return clone(diningData.locations);
  },

  async getDiningFull() {
    await delay(200);
    return clone(diningData);
  },

  async getMealPlan() {
    await delay(100);
    return clone(diningData.mealPlan);
  },

  async getDiningTransactions() {
    await delay(150);
    return clone(diningData.transactions);
  },

  async getGetAndGoLocations() {
    await delay(150);
    return clone(diningData.getAndGo.locations);
  },

  async getGetAndGoMenu(locationId) {
    await delay(200);
    const loc = diningData.getAndGo.locations.find(l => l.id === locationId);
    return loc ? clone(loc) : null;
  },

  async placeGetGoOrder(locationId, items) {
    await delay(800);
    // Simulate order placement
    const orderNum = Math.floor(Math.random() * 900) + 100;
    return {
      success: true,
      orderId: `GG-${orderNum}`,
      estimatedPickup: '10–15 min',
      items: clone(items)
    };
  },

  async getMakerspace() {
    await delay(200);
    return clone(makerspaceData);
  },

  async getMakerspaceSummary() {
    await delay(100);
    return {
      location: clone(makerspaceData.location),
      summary: clone(makerspaceData.summary),
      activePrint: clone(makerspaceData.activePrint)
    };
  },

  async getProfile() {
    await delay(150);
    return clone(profileData);
  },

  async search(query) {
    await delay(200);
    if (!query || query.trim().length < 2) return [];

    const q = query.toLowerCase();
    const results = [];

    // Search features
    const features = [
      { type: 'feature', title: 'Dashboard', description: 'Home dashboard with widgets', path: '/' },
      { type: 'feature', title: 'Classes', description: 'Your class schedule', path: '/' },
      { type: 'feature', title: 'CyRide', description: 'Bus routes and tracking', path: '/' },
      { type: 'feature', title: 'Dining & Meal Swipes', description: 'Dining locations, meal plan, GET & GO', path: '/dining' },
      { type: 'feature', title: 'GET & GO', description: 'Mobile food ordering with meal swipes', path: '/dining/getgo' },
      { type: 'feature', title: 'Makerspace Tracker', description: 'Machine availability & reservations', path: '/makerspace' },
      { type: 'feature', title: 'Map', description: 'Campus map', path: '/' },
      { type: 'feature', title: 'Events', description: 'Campus events', path: '/features' },
      { type: 'feature', title: 'Directory', description: 'Campus directory', path: '/features' },
      { type: 'feature', title: 'Library', description: 'Library hours and resources', path: '/features' },
      { type: 'feature', title: 'Laundry', description: 'Laundry room availability', path: '/features' },
      { type: 'feature', title: 'Student Orgs', description: 'Student organizations', path: '/features' },
      { type: 'feature', title: 'News', description: 'ISU campus news', path: '/features' },
      { type: 'feature', title: 'Profile', description: 'Your profile and settings', path: '/profile' }
    ];

    features.forEach(f => {
      if (f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
        results.push(f);
      }
    });

    // Search makerspace machines
    makerspaceData.areas.forEach(area => {
      if (area.name.toLowerCase().includes(q)) {
        results.push({
          type: 'makerspace-area',
          title: area.name,
          description: `${area.room} · ${area.machines.filter(m => m.status === 'available').length}/${area.machines.length} available`,
          path: '/makerspace'
        });
      }
      area.machines.forEach(m => {
        if (m.name.toLowerCase().includes(q)) {
          results.push({
            type: 'machine',
            title: m.name,
            description: `${area.name} · ${m.status === 'available' ? 'Available' : m.status === 'in-use' ? 'In Use' : 'Maintenance'}`,
            path: '/makerspace',
            status: m.status
          });
        }
      });
    });

    // Search classes
    classesData.today.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.room.toLowerCase().includes(q)) {
        results.push({
          type: 'class',
          title: c.name,
          description: `${c.time} · ${c.room}`,
          path: '/'
        });
      }
    });

    // Search dining
    diningData.locations.forEach(d => {
      if (d.name.toLowerCase().includes(q) || (d.building && d.building.toLowerCase().includes(q))) {
        results.push({
          type: 'dining',
          title: d.name,
          description: `${d.building} · ${d.hours}`,
          path: '/dining'
        });
      }
    });

    // Search GET & GO menus
    if (diningData.getAndGo) {
      diningData.getAndGo.locations.forEach(loc => {
        loc.menu.forEach(cat => {
          cat.items.forEach(item => {
            if (item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
              results.push({
                type: 'dining',
                title: item.name,
                description: `GET & GO · ${loc.name} · ${item.calories} cal`,
                path: '/dining/getgo'
              });
            }
          });
        });
      });
    }

    return results;
  }
};
