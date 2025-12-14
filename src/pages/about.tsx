// src/pages/AboutPage.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Chip,
  alpha,
  IconButton,
} from '@mui/material';
import {
  RestaurantMenu,
  People,
  BarChart,
  Inventory,
  Security,
  Speed,
  TrendingUp,
  EmojiObjects,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const features = [
    {
      icon: <Inventory fontSize='large' />,
      title: 'Smart Inventory',
      description:
        'Track products, stock levels, and pricing in real-time. Get low-stock alerts and optimize your inventory.',
      color: '#FF6B6B',
    },
    {
      icon: <People fontSize='large' />,
      title: 'Team Management',
      description:
        'Manage your staff efficiently with role-based access control, schedules, and performance tracking.',
      color: '#4ECDC4',
    },
    {
      icon: <BarChart fontSize='large' />,
      title: 'Sales Analytics',
      description:
        'Visualize trends, track revenue, and make data-driven decisions with powerful interactive charts.',
      color: '#45B7D1',
    },
    {
      icon: <RestaurantMenu fontSize='large' />,
      title: 'Transaction Hub',
      description:
        'Process orders seamlessly, manage payments, and keep detailed records of every transaction.',
      color: '#F7B731',
    },
    {
      icon: <Security fontSize='large' />,
      title: 'Enterprise Security',
      description:
        'Bank-grade encryption and secure authentication to protect your sensitive business data.',
      color: '#5F27CD',
    },
    {
      icon: <Speed fontSize='large' />,
      title: 'Lightning Fast',
      description:
        'Optimized performance ensures smooth operations even during peak hours.',
      color: '#00D2D3',
    },
  ];

  const stats = [
    { label: 'Efficiency Boost', value: '40%' },
    { label: 'Time Saved', value: '10hrs/week' },
    { label: 'Cost Reduction', value: '25%' },
    { label: 'User Satisfaction', value: '4.9/5' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDarkMode
          ? 'linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(30,30,35,1) 100%)'
          : 'linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(255,255,255,1) 100%)',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          data-testid='about-back-button'
          sx={{
            backgroundColor: isDarkMode
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            boxShadow: isDarkMode
              ? '0 4px 20px rgba(0,0,0,0.5)'
              : '0 4px 20px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: isDarkMode
                ? theme.palette.background.paper
                : theme.palette.background.paper,
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowBack />
        </IconButton>
      </Box>

      {/* Hero Section */}
      <Box
        data-testid='about-hero'
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          px: 2,
          background: isDarkMode
            ? `radial-gradient(circle at 50% 0%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`
            : `radial-gradient(circle at 50% 0%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 70%)`,
        }}
      >
        <Container maxWidth='lg'>
          <Stack spacing={4} alignItems='center' textAlign='center'>
            <Chip
              label='🚀 Modern Restaurant Management'
              color='primary'
              sx={{
                fontSize: '0.9rem',
                fontWeight: 600,
                px: 2,
                py: 2.5,
                borderRadius: 3,
              }}
            />
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              fontWeight={800}
              sx={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #fff 0%, #999 100%)'
                  : 'linear-gradient(135deg, #1a1a1a 0%, #666 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Elevate Your Restaurant
              <br />
              to the Next Level
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              maxWidth='800px'
              sx={{ lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.25rem' } }}
            >
              Gastrom is the all-in-one management system that transforms how
              you run your restaurant. From inventory to analytics, we've got
              you covered with cutting-edge technology and intuitive design.
            </Typography>
            <Stack
              direction='row'
              spacing={3}
              flexWrap='wrap'
              justifyContent='center'
              sx={{ pt: 2 }}
            >
              {stats.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: 'center',
                    minWidth: 120,
                  }}
                >
                  <Typography
                    variant='h4'
                    fontWeight={700}
                    color='primary'
                    sx={{ mb: 0.5 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features Grid */}
      <Container maxWidth='lg' sx={{ py: { xs: 6, md: 10 } }}>
        <Stack
          spacing={2}
          alignItems='center'
          textAlign='center'
          sx={{ mb: 6 }}
        >
          <Typography variant='h3' fontWeight={700}>
            Powerful Features
          </Typography>
          <Typography variant='h6' color='text.secondary' maxWidth='700px'>
            Everything you need to manage your restaurant efficiently, all in
            one place
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              elevation={0}
              sx={{
                height: '100%',
                background: isDarkMode
                  ? alpha(theme.palette.background.paper, 0.6)
                  : theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 3,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 40px ${alpha(feature.color, 0.15)}`,
                  borderColor: alpha(feature.color, 0.3),
                },
              }}
            >
              <CardContent sx={{ p: 3.5 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    background: `linear-gradient(135deg, ${alpha(feature.color, 0.2)} 0%, ${alpha(feature.color, 0.05)} 100%)`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant='h6' fontWeight={700} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ lineHeight: 1.7 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Mission Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          px: 2,
          background: isDarkMode
            ? alpha(theme.palette.primary.main, 0.03)
            : alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Container maxWidth='md'>
          <Stack spacing={4} alignItems='center' textAlign='center'>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <EmojiObjects fontSize='large' />
            </Box>
            <Typography variant='h3' fontWeight={700}>
              Our Mission
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{ lineHeight: 1.8, maxWidth: '700px' }}
            >
              We believe that running a restaurant should be about passion, not
              paperwork. Gastrom simplifies the complex world of restaurant
              management, letting you focus on what matters most: creating
              amazing experiences for your customers.
            </Typography>
            <Stack
              direction='row'
              spacing={1}
              flexWrap='wrap'
              justifyContent='center'
            >
              {['Innovation', 'Simplicity', 'Efficiency', 'Growth'].map(
                value => (
                  <Chip
                    key={value}
                    label={value}
                    variant='outlined'
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      borderWidth: 2,
                    }}
                  />
                )
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth='md' sx={{ py: { xs: 6, md: 10 } }}>
        <Card
          elevation={0}
          sx={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #5568d3 0%, #6b4c9a 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
            boxShadow: isDarkMode
              ? '0 20px 60px rgba(102, 126, 234, 0.25)'
              : '0 20px 60px rgba(102, 126, 234, 0.3)',
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
            <Stack spacing={3} alignItems='center'>
              <TrendingUp
                sx={{
                  fontSize: 60,
                  color: 'white',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                }}
              />
              <Typography
                variant='h4'
                fontWeight={700}
                sx={{
                  maxWidth: '600px',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Ready to Transform Your Business?
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  maxWidth: '500px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Join thousands of restaurants worldwide that trust Gastrom to
                streamline their operations and boost profitability.
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Have questions? Contact us at{' '}
                <Box
                  component='a'
                  href='mailto:support@gastrom.com'
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    textDecoration: 'underline',
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '3px',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      textDecorationColor: 'rgba(255, 255, 255, 0.7)',
                    },
                  }}
                >
                  support@gastrom.com
                </Box>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AboutPage;
