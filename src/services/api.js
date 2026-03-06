/**
 * Mock API service layer.
 * All data flows through here so swapping to real APIs later is trivial.
 */

import { fetchWeather } from './weather.js';
import classesData from '../data/classes.json';
import cyrideData from '../data/cyride.json';
import diningData from '../data/dining.json';
import makerspaceData from '../data/makerspace.json';
import profileData from '../data/profile.json';
import eventsData from '../data/events.json';
import laundryData from '../data/laundry.json';
import libraryData from '../data/library.json';
import newsData from '../data/news.json';
import stuorgsData from '../data/stuorgs.json';
import directoryData from '../data/directory.json';
import mapData from '../data/map.json';
import fairsData from '../data/fairs.json';

// Simulate network delay
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// Deep clone to prevent mutation
const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const api = {
  async getWeather() {
    return fetchWeather();
  },

  async getClasses() {
    await delay(150);
    return clone(classesData.today);
  },

  async getClassesFull() {
    await delay(200);
    return clone(classesData);
  },

  async getCyRide() {
    await delay(200);
    return clone(cyrideData.routes);
  },

  async getCyRideFull() {
    await delay(200);
    return clone(cyrideData);
  },

  async getEvents() {
    await delay(200);
    return clone(eventsData);
  },

  async getLaundry() {
    await delay(200);
    return clone(laundryData);
  },

  async getLibrary() {
    await delay(200);
    return clone(libraryData);
  },

  async getNews() {
    await delay(200);
    return clone(newsData);
  },

  async getStuOrgs() {
    await delay(200);
    return clone(stuorgsData);
  },

  async getDirectory() {
    await delay(200);
    return clone(directoryData);
  },

  async getMapLocations() {
    await delay(150);
    return clone(mapData);
  },

  async getFairs() {
    await delay(200);
    return clone(fairsData);
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
    const areas = makerspaceData.areas.map(a => {
      const avail = a.machines.filter(m => m.status === 'available').length;
      return { name: a.name.replace(/ Lab| Shop| & Soldering| & Textiles| & Milling/g, ''), avail, total: a.machines.length };
    });
    return {
      location: clone(makerspaceData.location),
      summary: clone(makerspaceData.summary),
      activePrint: clone(makerspaceData.activePrint),
      areas
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
      { type: 'feature', title: 'Classes', description: 'Your class schedule', path: '/classes' },
      { type: 'feature', title: 'CyRide', description: 'Bus routes and tracking', path: '/cyride' },
      { type: 'feature', title: 'Dining & Meal Swipes', description: 'Dining locations, meal plan, GET & GO', path: '/dining' },
      { type: 'feature', title: 'GET & GO', description: 'Mobile food ordering with meal swipes', path: '/dining/getgo' },
      { type: 'feature', title: 'Makerspace Tracker', description: 'Machine availability & reservations', path: '/makerspace' },
      { type: 'feature', title: 'Map', description: 'Campus map', path: '/map' },
      { type: 'feature', title: 'Events', description: 'Campus events', path: '/events' },
      { type: 'feature', title: 'Directory', description: 'Campus directory', path: '/directory' },
      { type: 'feature', title: 'Library', description: 'Library hours and resources', path: '/library' },
      { type: 'feature', title: 'Laundry', description: 'Laundry room availability', path: '/laundry' },
      { type: 'feature', title: 'Student Orgs', description: 'Student organizations', path: '/stuorgs' },
      { type: 'feature', title: 'News', description: 'ISU campus news', path: '/news' },
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
          path: '/classes'
        });
      }
    });

    // Search events
    eventsData.upcoming.forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)) {
        results.push({
          type: 'event',
          title: e.title,
          description: `${e.date} · ${e.location}`,
          path: '/events'
        });
      }
    });

    // Search student orgs
    stuorgsData.organizations.forEach(o => {
      if (o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)) {
        results.push({
          type: 'stuorg',
          title: o.name,
          description: `${o.members} members · ${o.meetingTime}`,
          path: '/stuorgs'
        });
      }
    });

    // Search directory
    directoryData.contacts.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.building.toLowerCase().includes(q)) {
        results.push({
          type: 'directory',
          title: c.name,
          description: `${c.building} · ${c.phone}`,
          path: '/directory'
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
