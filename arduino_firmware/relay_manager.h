#ifndef RELAY_MANAGER_H
#define RELAY_MANAGER_H

void initRelays();

bool setRelay(int channel, bool state, const char* source);

bool isRelayOn(int channel);

int getRelayCount();

#endif