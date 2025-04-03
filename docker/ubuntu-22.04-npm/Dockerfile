#
# You can build an image for this as follows:
#
#    docker build --build-arg USER=$USER -t ubuntu-22.04-npm docker/ubuntu-22.04-npm
#
# The image built above can be run as follows: 
#
#     docker run -v /home/sj:/home/sj -u sj -w /home/sj -it ubuntu-24.04-npm
#
FROM ubuntu:22.04

# Install base development system
RUN apt-get update && apt-get install -y \
    npm

# Add Raima groups and users conditionally
ARG USER
RUN \
    if [ "$USER" = "raima" ]; then \
        groupadd -g 1212 eng; \
        useradd -u 613 -g 1212 -M -s /bin/bash dtoyama; \
        useradd -u 728 -g 1212 -M -s /bin/bash dnguyen; \
        useradd -u 616 -g 1212 -M -s /bin/bash jparsons; \
        useradd -u 708 -g 1212 -M -s /bin/bash sj; \
    elif [ "$USER" = "dtoyama" ]; then \
        groupadd -g 1001 dtoyama; \
        useradd -u 1001 -g 1001 -M -s /bin/bash dtoyama; \
    elif [ "$USER" = "davidnguyen" ]; then \
        groupadd -g 20 staff; \
        useradd -u 501 -g 20 -M -s /bin/bash davidnguyen; \
    elif [ "$USER" = "jeffp" ]; then \
        useradd -u 1002 -g 1002 -M -s /bin/bash jeffp; \
        groupadd -g 1002 jeffp; \
    elif [ "$USER" = "sj" ]; then \
        groupadd -g 1001 sj; \
        useradd -u 1001 -g 1001 -M -s /bin/bash sj; \
    else \
        echo "No valid user specified or USER is empty"; \
    fi

# Make sure the cache is in a location accessible to everyone
RUN npm config set cache /tmp/.npm-cache --global
