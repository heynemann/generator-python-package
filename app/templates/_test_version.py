#!/usr/bin/env python
# -*- coding: utf-8 -*-

# This file is part of <%= package.name %>.
# <%= package.url %>

# Licensed under the <%= package.license %> license:
# http://www.opensource.org/licenses/<%= package.license%>-license
# Copyright (c) <%= package.created.year %>, <%= package.author.name %> <<%= package.author.email %>>

from preggy import expect

from <%= package.pythonName %> import __version__
from tests.base import TestCase


class VersionTestCase(TestCase):
    def test_has_proper_version(self):
        expect(__version__).to_equal('<%= package.version %>')
