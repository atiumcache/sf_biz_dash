import * as React from 'react';

import {
  Anchor,
  AudioWaveform,
  Building2,
  Command,
  Compass,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  MapPin,
  Mountain,
  PieChart,
  Ship,
  Sun,
  Trees,
  Waves,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';

import { NavUser } from '@/components/nav-user';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const data = {
  user: {
    name: 'Jane Doe',
    email: 'jane.doe@sf.gov',
    avatar: '/avatars/demo.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Downtown & Financial',
      url: '#',
      icon: Building2,
      items: [
        {
          title: 'Financial District',
          url: '/main-dashboard/FiDi',
        },
        {
          title: 'South of Market',
          url: '/main-dashboard/SoMa',
        },
        {
          title: 'Chinatown',
          url: '/main-dashboard/Chinatown',
        },
        {
          title: 'Tenderloin',
          url: '/main-dashboard/Tenderloin',
        },
      ],
    },
    {
      title: 'Central Hills',
      url: '#',
      icon: Mountain,
      items: [
        {
          title: 'Nob Hill',
          url: '/main-dashboard/Nob Hill',
        },
        {
          title: 'Russian Hill',
          url: '/main-dashboard/Russian Hill',
        },
        {
          title: 'Pacific Heights',
          url: '/main-dashboard/Pacific Heights',
        },
        {
          title: 'Presidio Heights',
          url: '/main-dashboard/Presidio Heights',
        },
        {
          title: 'Twin Peaks',
          url: '/main-dashboard/Twin Peaks',
        },
      ],
    },
    {
      title: 'North Bay Areas',
      url: '#',
      icon: Waves,
      items: [
        {
          title: 'North Beach',
          url: '/main-dashboard/North Beach',
        },
        {
          title: 'Marina',
          url: '/main-dashboard/Marina',
        },
        {
          title: 'Presidio',
          url: '/main-dashboard/Presidio',
        },
        {
          title: 'Seacliff',
          url: '/main-dashboard/Seacliff',
        },
        {
          title: 'Lincoln Park',
          url: '/main-dashboard/Lincoln Park',
        },
      ],
    },
    {
      title: 'Central Valley',
      url: '#',
      icon: Home,
      items: [
        {
          title: 'Hayes Valley',
          url: '/main-dashboard/Hayes Valley',
        },
        {
          title: 'Western Addition',
          url: '/main-dashboard/Western Addition',
        },
        {
          title: 'Japantown',
          url: '/main-dashboard/Japantown',
        },
        {
          title: 'Haight Ashbury',
          url: '/main-dashboard/Haight Ashbury',
        },
        {
          title: 'Castro',
          url: '/main-dashboard/Castro',
        },
        {
          title: 'Noe Valley',
          url: '/main-dashboard/Noe Valley',
        },
      ],
    },
    {
      title: 'Mission District',
      url: '#',
      icon: MapPin,
      items: [
        {
          title: 'Mission',
          url: '/main-dashboard/Mission',
        },
        {
          title: 'Mission Bay',
          url: '/main-dashboard/Mission Bay',
        },
        {
          title: 'Potrero Hill',
          url: '/main-dashboard/Potrero Hill',
        },
        {
          title: 'Bernal Heights',
          url: '/main-dashboard/Bernal Heights',
        },
      ],
    },
    {
      title: 'Richmond District',
      url: '#',
      icon: Trees,
      items: [
        {
          title: 'Inner Richmond',
          url: '/main-dashboard/Inner Richmond',
        },
        {
          title: 'Outer Richmond',
          url: '/main-dashboard/Outer Richmond',
        },
        {
          title: 'Golden Gate Park',
          url: '/neighborhood/Golden Gate Park',
        },
        {
          title: 'Lone Mountain/USF',
          url: '/main-dashboard/Lone Mountain/USF',
        },
      ],
    },
    {
      title: 'Sunset District',
      url: '#',
      icon: Sun,
      items: [
        {
          title: 'Inner Sunset',
          url: '/main-dashboard/Inner Sunset',
        },
        {
          title: 'Sunset/Parkside',
          url: '/main-dashboard/Sunset',
        },
        {
          title: 'West of Twin Peaks',
          url: '/main-dashboard/West of Twin Peaks',
        },
      ],
    },
    {
      title: 'Southern Districts',
      url: '#',
      icon: Compass,
      items: [
        {
          title: 'Glen Park',
          url: '/main-dashboard/Glen Park',
        },
        {
          title: 'Excelsior',
          url: '/main-dashboard/Excelsior',
        },
        {
          title: 'Outer Mission',
          url: '/main-dashboard/Outer Mission',
        },
        {
          title: 'OMI',
          url: '/neighborhood/OMI',
        },
        {
          title: 'Portola',
          url: '/neighborhood/Portola',
        },
        {
          title: 'Visitacion Valley',
          url: '/neighborhood/Visitacion Valley',
        },
        {
          title: 'McLaren Park',
          url: '/neighborhood/McLaren Park',
        },
      ],
    },
    {
      title: 'Southeast Bay',
      url: '#',
      icon: Ship,
      items: [
        {
          title: 'Bayview',
          url: '/main-dashboard/Bayview',
        },
        {
          title: 'Treasure Island',
          url: '/main-dashboard/Treasure Island',
        },
      ],
    },
    {
      title: 'Western Edge',
      url: '#',
      icon: Anchor,
      items: [
        {
          title: 'Lakeshore',
          url: '/main-dashboard/Lakeshore',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="p-0.5">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
